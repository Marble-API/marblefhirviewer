import { useCallback, useContext, useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { ItemsTable } from "../../components";
import { FhirContext } from "../../contexts/FhirContext";
import { ListBox } from "primereact/listbox";
import "./ResourceViewContainer.scss";
import {
  UnmappedFhirResource,
  DefaultTableColumnConfig,
} from "../../dataMapping/DefaultTableColumnConfig";
import { FhirResource, TableColumnConfig } from "../../interfaces";
import { FlattenedRow } from "../../components/ItemsTable/ItemsTable";

interface ResourceViewContainerProps {
  onOpenDetailViewClick: (data: any) => void;
}

const ResourceViewContainer = ({
  onOpenDetailViewClick,
}: ResourceViewContainerProps) => {
  const { fhirResources } = useContext(FhirContext);
  const { resourceType } = useParams();
  const { hash } = useLocation();
  const navigate = useNavigate();
  const [resourceList, setResourceList] = useState<Array<string>>([]);
  const [flattenedRows, setFlattenedRows] = useState<Array<FlattenedRow>>([]);
  const resourceId = hash?.slice(1);
  const columnConfig = resourceType
    ? DefaultTableColumnConfig[resourceType] ?? UnmappedFhirResource
    : UnmappedFhirResource;

  const flattenRows = useCallback(
    (
      resources: Array<FhirResource>,
      columnsConfig: Array<TableColumnConfig>,
      allResources: Array<FhirResource>
    ) => {
      const rows = resources.map((resource) => {
        const columns = columnsConfig.reduce<FlattenedRow>((prev, column) => {
          const value = column.getValue(resource, allResources);
          const body = column.renderer
            ? column.renderer(resource, allResources)
            : null;
          prev[column.label.replace(/ /g, "")] = {
            value,
            body,
          };
          return prev;
        }, {});

        return {
          ...columns,
          rawData: resource,
        } as FlattenedRow & { rawData: FhirResource };
      });

      setFlattenedRows(rows);
    },
    []
  );

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

  useEffect(() => {
    const filteredResources = fhirResources.filter(
      (f) =>
        // eslint-disable-next-line eqeqeq
        f.resourceType === resourceType && (!resourceId || f.id == resourceId)
    );

    flattenRows(filteredResources, columnConfig, fhirResources);
  }, [resourceId, columnConfig, fhirResources, resourceType, flattenRows]);

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
          <ItemsTable
            columnsConfig={columnConfig}
            items={flattenedRows}
            onDetailViewClick={onOpenDetailViewClick}
          />
        )}
      </div>
    </div>
  );
};

export default ResourceViewContainer;
