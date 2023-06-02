import { TableColumnConfig } from "../../../interfaces";

const Organization: Array<TableColumnConfig> = [
  {
    label: "Name",
    getValue: (r) => r.name,
  },
];

export default Organization;
