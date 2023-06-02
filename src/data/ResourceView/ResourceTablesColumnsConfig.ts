import { TableColumnConfig } from "../../interfaces";
import { Observation } from "./Configurations";

export const ResourceTablesColumnsConfig: {
  [key: string]: Array<TableColumnConfig>;
} = {
  Observation: Observation,
};

export const DefaultTablesColumnsConfig: Array<TableColumnConfig> = [
  {
    label: "Id",
    getValue: (r) => r.id,
  },
];
