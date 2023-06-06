import {
  buildParagraphList,
  formatDate,
  getAllCodeAsLinks,
  getAllCodesAsString,
  getValue,
} from "../../functions/FhirFunctions";
import { TableColumnConfig } from "../../interfaces";

const Observation: Array<TableColumnConfig> = [
  {
    label: "Date",
    getValue: (r) => formatDate(r.effectiveDateTime),
  },
  {
    label: "Name",
    getValue: (r) => getAllCodesAsString(r.code).join(", "),
  },
  {
    label: "Codes",
    getValue: (r) => getAllCodesAsString(r.code).join(", "),
    renderer: (r) => buildParagraphList(getAllCodeAsLinks(r.code)),
  },
  {
    label: "Value",
    getValue: (r) => getValue(r),
  },
];

export default Observation;
