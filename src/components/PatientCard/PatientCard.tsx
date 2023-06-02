import { Button } from "primereact/button";
import { useEffect, useState } from "react";
import SystemEnum from "../../enums/SystemEnum";
import { getHumanName } from "../../functions/FhirFunctions";
import GoogleMapsAddressLink from "../../functions/GoogleMapsAddressLink";
import PatientInfo from "../../interfaces/PatientInfo";
import "./PatientCard.scss";

interface PatientCardProps {
  patients?: Array<any>;
  onDetailViewClick?: (data: any) => void;
}

const PatientCard = ({ patients, onDetailViewClick }: PatientCardProps) => {
  const [patient, setPatient] = useState<any>({});
  const [patientNormalizedData, setPatientNormalizedData] =
    useState<PatientInfo | null>({});
  const [showDetails, setShowDetails] = useState<boolean>(false);
  const [otherTelecoms, setOtherTelecoms] = useState<Array<any>>([]);
  const [otherAddresses, setOtherAddresses] = useState<Array<any>>([]);

  useEffect(() => {
    const choosePatient = (index: number, patients?: Array<any>) => {
      if (!patients || patients.length === 0) return null;
      setPatient(patients[index]);
    };

    choosePatient(0, patients);
  }, [patients]);

  useEffect(() => {
    const getNormalizedPatientInfo = (patients: any) => {
      const patientData = patient;
      let fullName = null;

      if (patientData.name) {
        fullName = getHumanName(patientData?.name);
      }

      let phone: string | null = null;
      let email: string | null = null;
      if (patientData?.telecom?.length > 0) {
        phone = patientData.telecom.find(
          (x: any) => x.system === SystemEnum.Phone
        )?.value;
        email = patientData.telecom.find(
          (x: any) => x.system === SystemEnum.Email
        )?.value;

        setOtherTelecoms(
          patientData.telecom.filter(
            (f: any) => f.value !== phone && f.value !== email
          )
        );
      }

      let address: string | null = null;
      if (patientData?.address?.length > 0) {
        const firstAddress = patientData.address?.[0];
        address = formatAddress(firstAddress);

        setOtherAddresses(
          patientData.address.filter(
            (f: any) =>
              firstAddress !== null &&
              (firstAddress.line !== f.line ||
                firstAddress.city !== f.city ||
                firstAddress.state !== f.state ||
                firstAddress.postalCode !== f.postalCode ||
                firstAddress.country !== f.country)
          )
        );
      }

      const patientInfo: PatientInfo = {
        id: patientData.id ?? "",
        fullName: fullName ?? "",
        gender: patientData?.gender ?? "",
        dateOfBirth: patientData?.birthDate ?? "",
        phone: phone ?? "",
        email: email ?? "",
        address: address ?? "",
      };
      return patientInfo;
    };

    setPatientNormalizedData(getNormalizedPatientInfo(patient));
  }, [patient]);

  const formatAddress = (address?: any) => {
    return address.text
      ? address.text
      : `${address.line ?? ""} 
         ${address.city ?? ""} 
         ${address.state ?? ""} 
         ${address.postalCode ?? ""}
         ${address.country ?? ""}`;
  };

  return patientNormalizedData && patientNormalizedData.fullName ? (
    <div className={"patient-card-wrap"}>
      <div className={"patient-detail-link-wrap"}>
        <Button
          type="button"
          link
          onClick={() => onDetailViewClick && onDetailViewClick(patients)}
        >
          Detail View
        </Button>
      </div>
      <div className="patient-info-wrap">
        <div className="patient-info-container">
          <div className="patient-name">{patientNormalizedData.fullName}</div>
        </div>

        {patientNormalizedData.gender && (
          <div className="patient-info-container">
            <div className="label">Gender</div>
            <div className="value">{patientNormalizedData.gender}</div>
          </div>
        )}

        {patientNormalizedData.dateOfBirth && (
          <div className="patient-info-container">
            <div className="label">Date of Birth</div>
            <div className="value">{patientNormalizedData.dateOfBirth}</div>
          </div>
        )}

        {patientNormalizedData.phone && (
          <div className="patient-info-container">
            <div className="label">Phone</div>
            <div className="value">{patientNormalizedData.phone}</div>
          </div>
        )}

        {patientNormalizedData.email && (
          <div className="patient-info-container">
            <div className="label">Email</div>
            <div className="value">{patientNormalizedData.email}</div>
          </div>
        )}

        {patientNormalizedData.address && (
          <div className="patient-info-container">
            <div className="label">Address</div>
            <a
              href={GoogleMapsAddressLink(patient.address?.[0])}
              className="value link margin-fix"
              target="_blank"
              rel="noreferrer"
            >
              {patientNormalizedData.address}
            </a>
          </div>
        )}
      </div>

      <>
        {showDetails && (
          <div className="patient-info-wrap patient-more-contact">
            {otherTelecoms.length > 0 && (
              <div className="patient-info-container">
                <div className="label">Other Contacts</div>
                {otherTelecoms.map((m, i) => (
                  <div key={i}>
                    <div className="value">{m.value}</div>
                  </div>
                ))}
              </div>
            )}
            {otherAddresses.length > 0 && (
              <div className="patient-info-container">
                <div className="label">Other Addresses</div>
                {otherAddresses.map((m, i) => (
                  <div key={i}>
                    <a
                      href={GoogleMapsAddressLink(m)}
                      className="value link margin-fix"
                      target="_blank"
                      rel="noreferrer"
                    >
                      {formatAddress(m)}
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        <div className="patient-show-more-link-wrap patient-more-contact">
          <Button
            type="button"
            className={`e-link link${
              otherAddresses.length > 0 || otherTelecoms.length > 0
                ? ""
                : " is-hidden"
            }`}
            onClick={() => setShowDetails(!showDetails)}
          >
            {`${showDetails ? "Hide" : "Show More"}`}
          </Button>
        </div>
      </>
    </div>
  ) : (
    <></>
  );
};

export default PatientCard;
