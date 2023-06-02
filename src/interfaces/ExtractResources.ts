import ExtendedFile from "./ExtendedFile";

export default interface ExtractResources {
  json: Array<any>;
  xml: Array<ExtendedFile>;
  pdf: Array<ExtendedFile>;
  others: Array<ExtendedFile>;
}
