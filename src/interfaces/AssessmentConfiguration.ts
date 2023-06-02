import CodeableConceptCode from "./CodeableConceptCode";

export interface IAssessmentCodeableConcept {
  coding: Array<IAssessmentCodeableConceptCode>;
  text?: string;
}

export interface IAssessmentCodeableConceptCode extends CodeableConceptCode {
  amount?: number;
  claimResponseAmount?: number | string;
  flag: string;
  referenceResources?: Array<IAssessmentReferenceResource>;
  claimResourceId?: string;
  itemSequence?: number;
  claimIdentifier?: string;
  codeableConceptText?: string;
}

export interface IAssessmentCodeWithAdditionalInfoGetter {
  amount?: number;
  claimResponseAmount?: number | string;
  codes?: IAssessmentCodeableConcept;
  reference?: string;
  claimResourceId?: string;
  type?: string;
  sequence?: number;
  diagnosisSequence?: Array<number>;
  procedureSequence?: Array<number>;
  itemSequence?: number;
  flag?: string;
  referenceResources?: Array<IAssessmentReferenceResource>;
  claimIdentifier?: string;
}

export interface IAssessmentReferenceResource {
  resourceId: string;
  showResource: boolean;
}

export interface IAssessmentGetter {
  ResourceId: string;
  ResourceType: string;
  Date?: any;
  ProviderArray?: any;
  EncounterArray?: any;
  CodeInfo?: any;
}
