import SystemCodes from "../data/Shared/SystemCodes";
import SystemCodesUrl from "../data/Shared/SystemCodesUrl";
import { CodeableConceptType } from "../enums/CodeableConceptType";
import UseEnum from "../enums/UseEnum";
import {
  Address,
  CodeableConcept,
  HumanName,
  Identifier,
  Money,
  Period,
  Quantity,
  Ratio,
} from "../interfaces";

export const formatDate = (date: string | undefined) => {
  if (!date) return undefined;
  const newDate = new Date(date);
  return newDate.toISOString().split("T")?.[0];
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

export const getCodeLink = (isLink: boolean, array: any[], code: string) => {
  const codeLink = isLink
    ? Object.entries(SystemCodesUrl).find((codeLink) =>
        array.includes(codeLink[1])
      )
    : null;

  return codeLink ? `${codeLink[0]}${code}` : codeLink;
};

export const buildURL = (href: string, text: string) => (
  <a className="link" href={href} target="_blank" rel="noreferrer">
    ${text}
  </a>
);

export const getReferenceText = (dataRow: any, resources: any[]) => {
  let referenceText: string = "";
  const display: string = dataRow.display;
  const stringArray: Array<string> = dataRow.reference?.split("/");
  const resourceExists = resources.find((f) => f.id === stringArray?.[1]);
  const text = dataRow.reference ?? "";
  referenceText += resourceExists
    ? `<a href="#${stringArray?.[1]}">${text}</a>\n`
    : `${display && !display.startsWith("undefined") ? display : text}\n`;
  return referenceText;
};

export const getCode = (
  code: CodeableConcept,
  type: CodeableConceptType,
  isLink: boolean = false
) => {
  let codingText: string | undefined = undefined;

  if (code) {
    if (
      code.text &&
      (type === CodeableConceptType.Text || type === CodeableConceptType.Full)
    ) {
      codingText = `${code.text} \n`;
    }

    if (code.coding && Array.isArray(code.coding)) {
      for (const coding of code.coding) {
        const stringArray: Array<string | undefined> = [
          type !== CodeableConceptType.Code ? coding.display : "",
          type !== CodeableConceptType.Text ? getSystem(coding.system) : "",
          type !== CodeableConceptType.Text ? coding.code : "",
        ];
        if (type === CodeableConceptType.Text && codingText) {
          break;
        }
        codingText = codingText ?? "";

        const formatedCode = `${stringArray.filter((f) => f).join(": ")}\n`;
        const code = getCodeLink(isLink, stringArray, coding.code ?? "");
        if (isLink && code) {
          codingText += buildURL(code, formatedCode);
        } else {
          codingText += formatedCode;
        }
      }
    }
  }

  return codingText;
};

export const getCodeArray = (
  codeableConcepts: Array<CodeableConcept>,
  type: CodeableConceptType,
  isLink: boolean = false
) => {
  let codingText: string | undefined = undefined;

  if (codeableConcepts && codeableConcepts.length > 0) {
    codingText = "";
    codeableConcepts.forEach((element: any) => {
      codingText += getCode(element, type, isLink) ?? "";
    });
  }

  return codingText;
};

export const getIdentifier = (
  identifier: Identifier,
  isLink: boolean = false
) => {
  let identifierText: JSX.Element | string | undefined = undefined;

  if (identifier) {
    if (identifier.type) {
      identifierText = getCode(
        identifier.type,
        CodeableConceptType.Full,
        isLink
      );
    } else if (isLink) {
      const code = getCodeLink(
        isLink,
        [getSystem(identifier.system)],
        identifier.value ?? ""
      );

      if (code) {
        identifierText = buildURL(
          code,
          `${getSystem(identifier.system)}:${identifier.value}`
        );
      }
    } else if (identifier.system && identifier.value) {
      identifierText = `${getSystem(identifier.system)}: ${identifier.value}`;
    } else if (identifier.value) {
      identifierText = identifier.value;
    }
  }

  return identifierText;
};

export const getIdentifierArray = (
  identifiers: Array<Identifier>,
  isLink: boolean = false
) => {
  if (identifiers && Array.isArray(identifiers)) {
    return (
      <>
        {identifiers.map((element: any) => {
          let identifierValue = element;

          if (identifierValue.identifier !== undefined) {
            identifierValue = identifierValue.identifier;
          }

          return <p>{getIdentifier(identifierValue, isLink) ?? ""}</p>;
        })}
      </>
    );
  }

  return null;
};

export const getValue = (value: any) => {
  return (
    value?.valueString ??
    getCodeText(value) ??
    value?.valueBoolean ??
    value?.valueInteger ??
    getPeriod(value?.valuePeriod) ??
    getRatio(value?.valueRatio) ??
    getQuantity(value?.valueQuantity) ??
    getMoney(value?.valueMoney)
  );
};

export const getCodeText = (code: CodeableConcept) => {
  if (code.text && code.text.trim() !== "") {
    return code.text;
  }

  if (code.coding?.length >= 0) {
    return code.coding[0].display;
  }

  return null;
};

export const getCodes = (code: CodeableConcept, separator = ", ") => {
  const codes = code.coding.map((m) => `${getSystem(m.system)}: ${m.code}`);
  return codes.join(separator);
};

export const getCodeLinks = (code: CodeableConcept) => {
  const codeLinks = code.coding.map((m) => {
    const system = getSystem(m.system);
    const label = `${getSystem(m.system)}: ${m.code}`;
    const hasWebsite = SystemCodesUrl.hasOwnProperty(system);
    if (hasWebsite) {
      return (
        <a
          href={`${SystemCodesUrl[system]}${m.code}`}
          target="_blank"
          rel="noreferrer"
        >
          {label}
        </a>
      );
    }
    return <p>{label}</p>;
  });
  return <>{codeLinks}</>;
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
