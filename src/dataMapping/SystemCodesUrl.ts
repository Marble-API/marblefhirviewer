import CodeEnum from "../enums/CodeEnum";

const SystemCodesUrl: { [key: string]: string } = {
  [CodeEnum.npi]: "https://npiregistry.cms.hhs.gov/provider-view/",
  [CodeEnum.gpi]: "https://hellopharmacist.com/ndc-lookup?q=",
  [CodeEnum.ndc]: "https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=",
  [CodeEnum.cpt]: "http://www.medpricemonkey.com/cpt_code?cpt_code=",
  [CodeEnum.loinc]: "https://loinc.org/",
  [CodeEnum.snomed]: "https://snomedbrowser.com/Codes/Details/",
  [CodeEnum.icd9]: "https://icdlist.com/icd-9/look-up?s=",
  [CodeEnum.icd10]: "https://icdlist.com/?t=icd10&s=",
  [CodeEnum.cvx]:
    "https://phinvads.cdc.gov/vads/ViewCodeSystemConcept.action?oid=2.16.840.1.113883.12.292&code=",
  [CodeEnum.rxNorm]: "https://ndclist.com/rxnorm/rxcui/",
};

export default SystemCodesUrl;
