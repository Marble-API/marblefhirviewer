import {
  buildParagraphList,
  getAllCodeAsLinks,
  getAllCodesAsString,
  getAllDisplay,
} from "../../functions/FhirFunctions";
import { TableColumnConfig } from "../../interfaces";

const Medication: Array<TableColumnConfig> = [
  {
    label: "Codes",
    getValue: (r) => getAllCodesAsString(r.code).join(", "),
    renderer: (r) => buildParagraphList(getAllCodeAsLinks(r.code)),
  },
  {
    label: "Description",
    getValue: (r) => getAllCodesAsString(r.code).join(", "),
    renderer: (r) => buildParagraphList(getAllDisplay(r.code)),
  },
];

export default Medication;
