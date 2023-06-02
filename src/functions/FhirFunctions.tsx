import SystemCodes from "../data/Shared/SystemCodes";
import SystemCodesUrl from "../data/Shared/SystemCodesUrl";
import UseEnum from "../enums/UseEnum";
import {
  Address,
  CodeableConcept,
  CodeableConceptCode,
  FhirResource,
  HumanName,
  Identifier,
  Money,
  Period,
  Quantity,
  Ratio,
  Reference,
} from "../interfaces";

const getCodeLabel = (
  code: CodeableConceptCode,
  includeDisplay: boolean = false
) =>
  `${getSystem(code.system)}: ${code.code ?? "N/A"}${
    includeDisplay && code.display ? ` (${code.display})` : ""
  }`.trim();

export const formatDate = (date: string | undefined) => {
  if (!date) return undefined;
  const newDate = new Date(date);
  return newDate.toISOString().split("T")?.[0];
};

const getPeriod = (period?: Period) => {
  let periodString: string | undefined = undefined;

  if (!period) return periodString;

  if (period.start) {
    periodString = formatDate(period.start);
  }

  if (period.end) {
    periodString = periodString
      ? periodString + " to " + formatDate(period.end)
      : formatDate(period.end);
  }

  return periodString;
};

export const getHumanName = (
  humanNames: Array<HumanName>,
  separator: string = " "
) => {
  let name: string | undefined = undefined;

  if (humanNames && humanNames.length > 0) {
    let officialName = humanNames.find((x: any) => x.use === UseEnum.Official);

    if (!officialName) {
      officialName = humanNames[0];
    }

    if (officialName.text) {
      name = officialName.text;
    } else {
      name = `${
        officialName?.given ? officialName?.given?.join(separator) : ""
      }${separator}${officialName?.family ?? ""}`;
    }

    if (name.trim().length < 1) {
      name = undefined;
    }
  }

  return name;
};

export const getAddress = (address: Array<Address>) => {
  let fullAddress: string | undefined = undefined;

  if (address) {
    if (address[0].text) {
      fullAddress = address[0].text;
    } else {
      fullAddress = `${
        address?.[0]?.line ? address?.[0]?.line?.join(" ") : ""
      } ${address?.[0]?.city ?? ""} ${address?.[0]?.state ?? ""} ${
        address?.[0]?.postalCode ?? ""
      }`;
    }
  }

  return fullAddress;
};

export const getRatio = (ratio?: Ratio) => {
  let ratioString: string | undefined = undefined;

  if (!ratio) return ratioString;

  if (ratio.numerator && ratio.denominator) {
    ratioString = `${ratio.numerator.value ?? ""} ${
      ratio.numerator?.unit ?? ""
    } / ${ratio.denominator?.value ?? ""} ${ratio.denominator?.unit ?? ""}`;
  }

  return ratioString;
};

export const getQuantity = (quantity?: Quantity) => {
  if (!quantity || !quantity.value) return undefined;

  return `${quantity.comparator ?? ""} ${quantity.value} ${
    quantity.unit ?? ""
  }`;
};

export const getMoney = (money: Money) => {
  if (!money || !money.value) return undefined;

  return `${money?.currency ?? ""} ${money?.value ?? ""}`;
};

export const getSystem = (system: string | undefined) => {
  return SystemCodes[system ?? ""] ?? system;
};

export const buildURL = (href: string, text: string) => (
  <a className="link" href={href} target="_blank" rel="noreferrer">
    {text}
  </a>
);

export const getReferenceLink = (
  reference: Reference,
  allResources: FhirResource[]
) => {
  const referenceParts = reference.reference?.split("/");

  if (!referenceParts || referenceParts.length < 2) {
    return `${reference.reference} ${reference.display}`;
  }

  const resourceType = referenceParts[referenceParts?.length - 2];
  const resourceId = referenceParts[referenceParts?.length - 1];
  const matchingResource = allResources.find(
    // eslint-disable-next-line eqeqeq
    (f) => f.resourceType === resourceType && f.id == resourceId
  );

  if (matchingResource) {
    return (
      <a href={`/Resources/${resourceType}#${resourceId}`}>
        {resourceType}/{resourceId}
      </a>
    );
  }

  return `${reference.reference} ${reference.display}`;
};

export const getIdentifierAsText = (identifier: Identifier) =>
  `${getSystem(identifier.system)}: ${identifier.value ?? "N/A"}`;

export const getIdentifierArray = (identifiers: Array<Identifier>) => {
  if (identifiers && Array.isArray(identifiers)) {
    return (
      <>
        {identifiers.map((element: any) => {
          let identifierValue = element;

          if (identifierValue.identifier !== undefined) {
            identifierValue = identifierValue.identifier;
          }

          return <p>{getIdentifierAsText(identifierValue)}</p>;
        })}
      </>
    );
  }

  return null;
};

export const getValue = (value: any) => {
  return (
    value?.valueString ??
    getFirstDisplayAsString(value) ??
    value?.valueBoolean ??
    value?.valueInteger ??
    getPeriod(value?.valuePeriod) ??
    getRatio(value?.valueRatio) ??
    getQuantity(value?.valueQuantity) ??
    getMoney(value?.valueMoney)
  );
};

export const getFirstDisplayAsString = (code: CodeableConcept) => {
  if (code.text && code.text.trim() !== "") {
    return code.text;
  }

  if (code.coding?.length >= 0) {
    return code.coding[0].display;
  }

  return null;
};

export const getAllDisplayAsParagraphs = (code: CodeableConcept) => {
  const items: JSX.Element[] = [];
  if (code.text && code.text.trim() !== "") {
    items.push(<p>{code.text}</p>);
  }

  code.coding
    .filter((f) => f.display?.trim() !== "")
    .forEach((f) => items.push(<p>{f.display}</p>));

  return <>{items}</>;
};

export const getAllCodesAsString = (
  code: CodeableConcept,
  separator = ", ",
  includeDisplay: boolean = false
) => {
  const codes = code.coding.map((m) => getCodeLabel(m, includeDisplay));
  return codes.join(separator);
};

export const getAllCodeAsLinks = (
  code: CodeableConcept,
  includeDisplay: boolean = false
) => {
  const codeLinks = code.coding.map((m) => {
    const system = getSystem(m.system);
    const label = getCodeLabel(m, includeDisplay);
    const hasWebsite = SystemCodesUrl.hasOwnProperty(system);
    if (hasWebsite) {
      return <p>{buildURL(`${SystemCodesUrl[system]}${m.code}`, label)}</p>;
    }
    return <p>{label}</p>;
  });
  return <>{codeLinks}</>;
};
