import {
  getAllCodeAsLinks,
  getAllCodesAsString,
  getAllDisplayAsParagraphs,
} from "../../../functions/FhirFunctions";
import { TableColumnConfig } from "../../../interfaces";

const Medication: Array<TableColumnConfig> = [
  {
    label: "Codes",
    getValue: (r) => getAllCodesAsString(r.code),
    renderer: (r) => getAllCodeAsLinks(r.code),
  },
  {
    label: "Description",
    getValue: (r) => getAllCodesAsString(r.code),
    renderer: (r) => getAllDisplayAsParagraphs(r.code),
  },
];

export default Medication;
