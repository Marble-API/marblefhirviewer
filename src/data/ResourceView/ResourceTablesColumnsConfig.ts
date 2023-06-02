import { TableColumnConfig } from "../../interfaces";
import { Observation, MedicationStatement, Medication } from "./Configurations";

export const ResourceTablesColumnsConfig: {
  [key: string]: Array<TableColumnConfig>;
} = {
  Observation: Observation,
  MedicationStatement: MedicationStatement,
  Medication: Medication,
};

export const DefaultTablesColumnsConfig: Array<TableColumnConfig> = [
  {
    label: "Id",
    getValue: (r) => r.id,
  },
];
