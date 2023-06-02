import { TableColumnConfig } from "../../interfaces";
import {
  Observation,
  MedicationStatement,
  Medication,
  Organization,
} from "./Configurations";

export const ResourceTablesColumnsConfig: {
  [key: string]: Array<TableColumnConfig>;
} = {
  Observation: Observation,
  MedicationStatement: MedicationStatement,
  Medication: Medication,
  Organization: Organization,
};

export const DefaultTablesColumnsConfig: Array<TableColumnConfig> = [
  {
    label: "Id",
    getValue: (r) => r.id,
  },
];
