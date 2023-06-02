import CodeableConcept from "./CodeableConcept";

export default interface Identifier {
  type?: CodeableConcept;
  system?: string;
  value?: string;
}
