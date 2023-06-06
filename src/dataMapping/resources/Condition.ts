import {
  buildParagraphList,
  getAllCodeAsLinks,
  getAllCodesAsString,
} from "../../functions/FhirFunctions";
import { TableColumnConfig } from "../../interfaces";

const Condition: Array<TableColumnConfig> = [
  {
    label: "Code",
    getValue: (r) => getAllCodesAsString(r.code).join(", "),
    renderer: (r) => buildParagraphList(getAllCodeAsLinks(r.code, true)),
  },
];

export default Condition;
