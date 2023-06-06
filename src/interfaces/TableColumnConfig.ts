import FhirResource from "./FhirResource";

export default interface TableColumnConfig {
  label: string;
  getValue: (
    resource: FhirResource,
    additionalResources: FhirResource[] | undefined | null
  ) => string | number | undefined | null;
  renderer?: (
    resource: FhirResource,
    additionalResources: FhirResource[]
  ) => JSX.Element | string | undefined | null;
}
