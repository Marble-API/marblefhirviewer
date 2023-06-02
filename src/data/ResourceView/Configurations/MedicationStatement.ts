import { formatDate } from "../../../functions/FhirFunctions";
import { TableColumnConfig } from "../../../interfaces";

const MedicationStatement: Array<TableColumnConfig> = [
  {
    label: "Date",
    getValue: (r) => formatDate(r.effectiveDateTime),
  },
  // {
  //   label: "Name",
  //   getValue: (r) => getCodeText(r.code),
  // },
  // {
  //   label: "Codes",
  //   getValue: (r) => getCodes(r.code),
  //   renderer: (r) => getCodeLinks(r.code),
  // },
];

export default MedicationStatement;
