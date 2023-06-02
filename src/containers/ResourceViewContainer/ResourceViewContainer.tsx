import { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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
  const { hash } = useLocation();
  const navigate = useNavigate();
  const [resourceList, setResourceList] = useState<Array<string>>([]);

  let resourceType = hash?.slice(1);

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
          onChange={(e) => navigate(`#${e.value}`)}
        />
      </div>
      <div className="viewer-content">
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
      </div>
    </div>
  );
};

export default ResourceViewContainer;
