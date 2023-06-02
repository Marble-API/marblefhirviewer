import {
  formatDate,
  getCodeLinks,
  getCodeText,
  getCodes,
  getValue,
} from "../../../functions/FhirFunctions";
import { TableColumnConfig } from "../../../interfaces";

const Observation: Array<TableColumnConfig> = [
  {
    label: "Date",
    getValue: (r) => formatDate(r.effectiveDateTime),
  },
  {
    label: "Name",
    getValue: (r) => getCodeText(r.code),
  },
  {
    label: "Codes",
    getValue: (r) => getCodes(r.code),
    renderer: (r) => getCodeLinks(r.code),
  },
  {
    label: "Value",
    getValue: (r) => getValue(r),
  },
];

export default Observation;
