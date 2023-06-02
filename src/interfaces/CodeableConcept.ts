import CodeableConceptCode from "./CodeableConceptCode";

export default interface CodeableConcept {
  coding: Array<CodeableConceptCode>;
  text: string;
}
