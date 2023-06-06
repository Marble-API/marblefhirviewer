import FhirResource from "./FhirResource";

export default interface TableColumnConfig {
  label: string;
  getValue: (
    resource: FhirResource,
    allResources: FhirResource[] | undefined | null
  ) => string | number | undefined | null;
  renderer?: (
    resource: FhirResource,
    allResources: FhirResource[]
  ) => JSX.Element | string | undefined | null;
}
