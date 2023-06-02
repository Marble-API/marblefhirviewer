export default interface FhirResource {
  id: string;
  resourceType: string;
  [key: string]: any;
}
