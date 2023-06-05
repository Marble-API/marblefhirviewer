import { TableColumnConfig } from "../interfaces";
import { default as Medication } from "./resources/Medication";
import { default as MedicationStatement } from "./resources/MedicationStatement";
import { default as Observation } from "./resources/Observation";
import { default as Organization } from "./resources/Organization";
import { default as Condition } from "./resources/Condition";

export const DefaultTableColumnConfig: {
  [key: string]: Array<TableColumnConfig>;
} = {
  Condition: Condition,
  Observation: Observation,
  Organization: Organization,
  Medication: Medication,
  MedicationStatement: MedicationStatement,
};

export const UnmappedFhirResource: Array<TableColumnConfig> = [
  {
    label: "Id",
    getValue: (r) => r.id,
  },
];
