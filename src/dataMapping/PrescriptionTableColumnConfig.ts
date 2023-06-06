import {
  findReferenceResource,
  findReferenceResourceFromUri,
  formatDate,
  getAddress,
  getAllCodesAsString,
  getAllDisplay,
} from "../functions/FhirFunctions";
import { TableColumnConfig } from "../interfaces";

export const PrescriptionTableColumnConfig: Array<TableColumnConfig> = [
  {
    label: "Quantity",
    getValue: (r) => r.quantity.value,
  },
  {
    label: "Days Supply",
    getValue: (r) => r.daysSupply.value,
  },
  {
    label: "When Prepared",
    getValue: (r) => formatDate(r.whenPrepared),
  },
  {
    label: "NDC",
    getValue: (r, a) => {
      const medication = findReferenceResource(r.medicationReference, a);
      return medication
        ? getAllCodesAsString(medication.code).join(", ")
        : "N/A";
    },
  },
  {
    label: "Drug Name",
    getValue: (r, a) => {
      const medication = findReferenceResource(r.medicationReference, a);
      return medication ? getAllDisplay(medication.code).join(", ") : "N/A";
    },
  },
  {
    label: "Prescriber",
    getValue: (r, a) => {
      const prescriberActor = r.performer.find((f: any) =>
        f.actor?.reference?.includes("Practitioner")
      );
      const prescriber = prescriberActor
        ? findReferenceResourceFromUri(prescriberActor.actor.reference, a)
        : undefined;

      return prescriber ? getAddress(prescriber.address) : "N/A";
    },
  },
];
