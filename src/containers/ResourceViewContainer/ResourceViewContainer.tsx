import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ResourceTable } from "../../components";
import { FhirContext } from "../../contexts/FhirContext";
import { ListBox } from "primereact/listbox";
import "./ResourceViewContainer.scss";
import {
  DefaultTablesColumnsConfig,
  ResourceTablesColumnsConfig,
} from "../../data/ResourceView/ResourceTablesColumnsConfig";

interface ResourceViewContainerProps {
  onOpenDetailViewClick: (data: any) => void;
}

const ResourceViewContainer = ({
  onOpenDetailViewClick,
}: ResourceViewContainerProps) => {
  const { fhirResources } = useContext(FhirContext);
  const { resourceType } = useParams();
  const navigate = useNavigate();
  const [resourceList, setResourceList] = useState<Array<string>>([]);

  useEffect(() => {
    const items: Array<string> = [];
    fhirResources.forEach((element) => {
      const item = items.includes(element.resourceType);
      if (!item) {
        items.push(element.resourceType);
      }
    }, []);

    setResourceList(items);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fhirResources]);

  return (
    <div className="viewer-wrapper">
      <div className="viewer-sidebar">
        <ListBox
          value={resourceType}
          options={resourceList}
          onChange={(e) => navigate(`/Resources/${e.value}`)}
        />
      </div>
      <div className="viewer-content">
        {!resourceType ||
          (resourceType === "" && <p>Please select a Resource Type</p>)}
        {resourceType && resourceType !== "" && (
          <ResourceTable
            columnsConfig={
              ResourceTablesColumnsConfig[resourceType] ??
              DefaultTablesColumnsConfig
            }
            resources={fhirResources.filter(
              (f) => f.resourceType === resourceType
            )}
            allResources={fhirResources}
            onDetailViewClick={onOpenDetailViewClick}
          />
        )}
      </div>
    </div>
  );
};

export default ResourceViewContainer;
