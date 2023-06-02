import {
  buildParagraphList,
  formatDate,
  getAllCodeAsLinks,
  getReferenceLink,
} from "../../../functions/FhirFunctions";
import { TableColumnConfig } from "../../../interfaces";

const MedicationStatement: Array<TableColumnConfig> = [
  {
    label: "Date",
    getValue: (r) => formatDate(r.effectiveDateTime),
  },
  {
    label: "Medication",
    getValue: (r, a) => {
      const reference = getReferenceLink(r.medicationReference, a ?? []);
      const codeableConcept = r.medicationCodeableConcept
        ? getAllCodeAsLinks(r.medicationCodeableConcept)
        : [];
      return buildParagraphList([reference, ...codeableConcept]);
    },
  },
  // {
  //   label: "Codes",
  //   getValue: (r) => getCodes(r.code),
  //   renderer: (r) => getCodeLinks(r.code),
  // },
];

export default MedicationStatement;
