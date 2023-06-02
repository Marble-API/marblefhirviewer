import { useState } from "react";
import {
  getAllCodeAsLinks,
  getFirstDisplayAsString,
  getIdentifierArray,
  getReferenceLink,
} from "../../functions/FhirFunctions";
import GoogleMapsAddressLink from "../../functions/GoogleMapsAddressLink";
import { CodeableConcept, Identifier } from "../../interfaces";
import "./ResourceVisualizer.scss";
import { camelCaseToTitleCase, isOnlyNumbers } from "../../functions/Utils";

interface ResourceVisualizerProps {
  selectedResource: string;
  resources: Array<any>;
  onResourceClick: (resourceId: string) => void;
}

const ResourceVisualizer = ({
  selectedResource,
  resources,
  onResourceClick,
}: ResourceVisualizerProps) => {
  const DateColumns = ["birthDate", "lastUpdated", "effectiveDateTime"];
  const [minimizedObjects, setMinimizedObjects] = useState<Array<string>>([]);

  const minimize = (componentId: string) => {
    if (minimizedObjects.includes(componentId)) {
      setMinimizedObjects(minimizedObjects.filter((f) => f !== componentId));
      return;
    }

    setMinimizedObjects(minimizedObjects.concat([componentId]));
  };

  const renderObject = (object: any, parent: string = "") => {
    return Object.entries(object).map(([key, value]) => {
      const id = `${parent}_${key}`;
      const isMinimized = minimizedObjects.includes(id);

      return (
        <div
          key={"detail" + id}
          className={getClassName(key, value, "Container")}
        >
          {!isOnlyNumbers(key) && (
            <div className={getClassName(key, value, "Title")}>
              {`${camelCaseToTitleCase(key).replace("Codeable Concept", "")}${
                !isOnlyNumbers(key) && typeof value !== "object" ? ": " : ""
              }`}
              {typeof value == "object" && (
                <div className="minimizeObject" onClick={() => minimize(id)}>
                  {isMinimized ? "+" : "-"}
                </div>
              )}
            </div>
          )}
          <div
            className={`${getClassName(key, value, "Value")} key-${key} ${
              isMinimized ? "minimized" : ""
            }`}
          >
            {renderProperty(key, value, parent)}
          </div>
        </div>
      );
    });
  };

  const renderProperty = (key: string, value: any, parent: string) => {
    if (value.reference !== undefined) {
      if (typeof value.reference === "object") {
        return renderObject(value, `${parent}_${key}`);
      }

      return renderReference(value);
    }

    if (value.coding !== undefined) {
      return renderCoding(value);
    }

    if (key === "identifier") {
      var identifiers = renderIdentifier(value);

      if (identifiers) {
        return identifiers;
      }
    }

    if (key === "address") {
      value = Array.isArray(value) ? value : [value];
      return renderAddresses(value);
    }

    if (typeof value === "object") {
      return renderObject(value, `${parent}_${key}`);
    }

    if (key === "resourceType") {
      return renderResourceType(value);
    }

    if (value && DateColumns.includes(key)) {
      const newDate = new Date(value);
      value = newDate.toISOString().split("T")?.[0];
    }

    return value as string;
  };

  const renderCoding = (code: CodeableConcept) => {
    return (
      <>
        <div>{getFirstDisplayAsString(code)}</div>
        <div>{getAllCodeAsLinks(code, true)}</div>
      </>
    );
  };

  const renderResourceType = (resourceType: string) => {
    return (
      <div className="resourceTypeContainer">
        <div className="resourceTypeValue">
          <a
            className="link"
            target="_blank"
            href={`https://www.hl7.org/fhir/${resourceType.toLowerCase()}.html`}
            rel="noreferrer"
          >
            {camelCaseToTitleCase(resourceType)}
            <span></span>
          </a>
        </div>
      </div>
    );
  };

  const renderReference = (reference: any) => {
    const referenceLink = getReferenceLink(reference, resources);

    return <div className="referenceContainer">{referenceLink}</div>;
  };

  const renderIdentifier = (identifiers: Array<Identifier>) => {
    const identifiersLink = getIdentifierArray(identifiers);

    if (!identifiersLink) {
      return;
    }

    return (
      <div className="identifierContainer">
        <div className="identifierValue">{identifiersLink}</div>
      </div>
    );
  };

  const renderAddresses = (addresses: Array<any>) => {
    return (
      <div className="identifierContainer">
        {addresses.map((address, i) => {
          const addressLink = GoogleMapsAddressLink(address);

          return (
            <div key={i}>
              <div>{renderObject(address)}</div>
              <a
                href={addressLink}
                className="link"
                target="_blank"
                rel="noreferrer"
              >
                View Address
                <span className="e-btn-icon e-icons e-icon-right e-open-link"></span>
              </a>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="resource">{renderObject(JSON.parse(selectedResource))}</div>
  );
};

const getClassName = (key: string, value: any, type: string) => {
  var valueType =
    typeof value == "object"
      ? isOnlyNumbers(key)
        ? "item"
        : "object"
      : "property";

  return `${valueType}${type}`;
};

export default ResourceVisualizer;
