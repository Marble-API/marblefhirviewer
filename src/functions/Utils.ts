import JSZip from "jszip";
import SystemCodes from "../data/Shared/SystemCodes";
import CodeEnum from "../enums/CodeEnum";
import ExtendedFile from "../interfaces/ExtendedFile";

export const unZipFile = async (zippedFile: File): Promise<Array<File>> => {
  const extractedResources: Array<File> = [];

  const promises: Promise<ExtendedFile>[] = [];
  var zip = new JSZip();
  var extractedZipped = await zip.loadAsync(zippedFile);
  var extractedZippedFiles = extractedZipped.files;

  extractedZipped.forEach(async (f) => {
    promises.push(
      extractedZippedFiles[f].async("blob").then(async (blob) => {
        return new File([blob], f, {
          lastModified: extractedZippedFiles[f].date.getTime(),
        });
      })
    );
  });

  await Promise.all(promises).then((t) => {
    t.forEach((f) => {
      extractedResources.push(f);
    });
  });

  return extractedResources;
};

export const readJsonFileAsync = (file: File) => {
  return new Promise<any>((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const fileReadResult = reader.result?.toString();

      if (fileReadResult) {
        const resource = JSON.parse(fileReadResult);
        resolve(resource);
      }
      reject();
    };

    reader.onerror = reject;

    reader.readAsText(file);
  });
};

export const getMaxDate = (dates: Date[]) => {
  if (dates.length > 0) {
    const maxDate = dates.reduce((a, b) => {
      return a > b ? a : b;
    });
    return maxDate;
  }
  return undefined;
};

export const getMinDate = (dates: Date[]) => {
  if (dates.length > 0) {
    const minDate = dates.reduce((a, b) => {
      return a < b ? a : b;
    });
    return minDate;
  }
  return undefined;
};

export const sortArray = (
  arr: Array<any>,
  key: string,
  isDescending: boolean = false
) => {
  const sortedArray = arr.sort((a, b) => {
    if (a[key] === undefined || a[key] === null) {
      return 1;
    }

    if (b[key] === undefined || b[key] === null) {
      return -1;
    }

    if (a[key] === b[key]) {
      return 0;
    }

    if (isDescending) {
      return a[key] < b[key] ? 1 : -1;
    }

    return a[key] < b[key] ? -1 : 1;
  });

  return sortedArray;
};

export const formatDate = (date: Date): string => {
  const year = date.toLocaleString("default", { year: "numeric" });
  const month = date.toLocaleString("default", { month: "2-digit" });
  const day = date.toLocaleString("default", { day: "2-digit" });

  return `${year}-${month}-${day}`;
};

export const addCodeMapping = (
  codeMapping: any,
  system: string,
  code: string
) => {
  if (!codeMapping) {
    codeMapping = {};
  }
  const localSystem = system.toLowerCase();
  if (!codeMapping[localSystem]) {
    codeMapping[localSystem] = {};
  }
  if (!codeMapping[localSystem][code]) {
    codeMapping[localSystem][code] = "";
  }

  return codeMapping;
};

export const getSystemCode = (systemCode: string): string => {
  const system = systemCode ?? "";
  return SystemCodes[system] ?? system;
};

// system code should be the return from the getSystemCode.
export const getCodeValue = (systemCode: string, codeValue: string): string => {
  const system = systemCode.replace(/ /g, "");
  return system === CodeEnum.ndc
    ? codeValue.replace(/\D/g, "").padStart(11, "0")
    : codeValue;
};

export const getCodeDescription = (
  codeMapping: any,
  systemCode: string,
  codeValue: string,
  codeDescription: string
): string => {
  const system = systemCode.replace(/ /g, "");
  const mappingDescription = codeMapping?.[system.toLowerCase()]?.[codeValue];
  return mappingDescription ? mappingDescription : codeDescription;
};

export const getCodeCategory = (
  codeMapping: any,
  systemCode: string,
  codeValue: string,
  mapping: string
): string => {
  const system = systemCode.replace(/ /g, "");
  const specificMapping = codeMapping[`${system}-${codeValue}`];
  const genericMapping = codeMapping[`${system}-*`];
  return specificMapping
    ? specificMapping[mapping]
    : genericMapping
    ? genericMapping[mapping]
    : "Other";
};
