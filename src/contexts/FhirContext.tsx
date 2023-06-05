import { createContext, useCallback, useEffect, useState } from "react";
import { DropZone } from "../components";
import FileTypes from "../enums/FileTypes";
import ResourceTypesEnum from "../enums/ResourceTypesEnum";
import { readJsonFileAsync, unZipFile } from "../functions/Utils";
import ExtendedFile from "../interfaces/ExtendedFile";
import { downloadFile } from "../functions/Api";
import { FhirResource } from "../interfaces";

interface IFhirContext {
  fhirResources: Array<FhirResource>;
  patients?: Array<FhirResource>;
  isLoading: Boolean;
}

export const FhirContext = createContext<IFhirContext>({
  fhirResources: [],
  patients: [],
  isLoading: false,
});

export const FhirContextProvider: React.FC<{
  children?: React.ReactNode;
}> = ({ children }) => {
  const [fhirResources, setFhirResources] = useState<Array<FhirResource>>([]);
  const [patients, setPatients] = useState<Array<FhirResource>>([]);
  const [isLoadingResources, setIsLoadingResources] = useState(false);
  const [isLoadingDroppedResources, setIsLoadingDroppedResources] =
    useState(false);
  const query = new URLSearchParams(document.location.search);
  const dataUri = query.get("dataUris");

  const forceExtension = (file: ExtendedFile) => {
    file.extension = file.name.split(".").pop();
    return file;
  };

  const onResourceLoadHandler = useCallback(async (files: Array<File>) => {
    const unzippedFiles: Array<ExtendedFile> = (
      await Promise.all(
        files.filter((f) => f.name.endsWith(FileTypes.ZIP)).map(unZipFile)
      )
    ).flatMap((f) => f);

    const allFiles = files.concat(unzippedFiles);

    const jsonFiles: Array<ExtendedFile> = allFiles
      .filter((f) => f.name.endsWith(FileTypes.JSON))
      .map(forceExtension);

    const fhirFiles: Array<any> = [];

    var promisesJson = jsonFiles.map(async (m) => {
      const json = await readJsonFileAsync(m);
      if (json.resourceType) {
        if (json.resourceType === ResourceTypesEnum.Bundle) {
          for (let index = 0; index < json.entry.length; index++) {
            const item = json.entry[index];
            if (!fhirFiles.some((s) => s.id === item.resource.id)) {
              fhirFiles.push(item.resource);
            }
          }
        } else {
          if (!fhirFiles.some((s) => s.id === json.id)) {
            fhirFiles.push(json);
          }
        }
      }
    });

    await Promise.all([...promisesJson]);
    setFhirResources(fhirFiles);
    const patientData = fhirFiles.filter(
      (f) => f.resourceType === ResourceTypesEnum.Patient
    );
    setPatients(patientData);
  }, []);

  useEffect(() => {
    const downloadZip = async (url: string) => {
      const response = await downloadFile(url);
      if (response) {
        return response;
      } else {
        alert("Failed to download file.");
      }
    };

    const loadResourcesFromDataUri = async () => {
      if (dataUri) {
        setIsLoadingResources(true);
        const files = await Promise.all(dataUri.split("|").map(downloadZip));

        await onResourceLoadHandler(files.filter((f): f is File => !!f));

        setIsLoadingResources(false);
      }
    };

    loadResourcesFromDataUri();
  }, [onResourceLoadHandler, dataUri]);

  return (
    <FhirContext.Provider
      value={{
        fhirResources,
        patients,
        isLoading: isLoadingResources || isLoadingDroppedResources,
      }}
    >
      <>
        {children}
        {fhirResources.length === 0 && !dataUri && (
          <DropZone
            onResourceDataLoad={onResourceLoadHandler}
            setIsLoading={setIsLoadingDroppedResources}
          />
        )}
      </>
    </FhirContext.Provider>
  );
};

export const FhirContextConsumer = FhirContext.Consumer;
