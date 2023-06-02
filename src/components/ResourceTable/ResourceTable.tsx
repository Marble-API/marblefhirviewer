import { useCallback, useEffect, useState } from "react";
import { FhirResource, TableColumnConfig } from "../../interfaces";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import "./ResourceTable.scss";
import { Button } from "primereact/button";

interface TableProps {
  columnsConfig: Array<TableColumnConfig>;
  resources: Array<FhirResource>;
  allResources: Array<FhirResource>;
  onDetailViewClick?: (data: any) => void;
}

interface FlattenedRow {
  [key: string]: {
    value: any;
    body: string | JSX.Element | null | undefined;
  };
}

const ResourceTable = ({
  columnsConfig,
  resources,
  allResources,
  onDetailViewClick: onOpenDetailViewClick,
}: TableProps) => {
  const [flattenedRows, setFlattenedRows] = useState<
    Array<FlattenedRow & { rawData: FhirResource }>
  >([]);

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
    if (resources && columnsConfig && allResources && flattenRows) {
      flattenRows(resources, columnsConfig, allResources);
    }
  }, [resources, columnsConfig, allResources, flattenRows]);

  const renderColumns = (type: string) => {
    const columns: JSX.Element[] = [];

    columnsConfig.forEach((config, i) => {
      const field = config.label.replace(/ /g, "");
      console.log(field);
      columns.push(
        <Column
          sortable
          key={"Column_" + i + type}
          field={`${field}.value`}
          header={config.label}
          body={(r) => {
            if (r?.hasOwnProperty(field)) {
              return r[field].body ?? r[field].value;
            }
            return "";
          }}
        />
      );
    });

    columns.push(
      <Column
        key={"Column_ActionButton" + type}
        header="Actions"
        body={renderActionButton}
        sortable={false}
      />
    );

    return columns;
  };

  const renderActionButton = (props: any) => {
    return (
      <>
        <Button
          type="button"
          onClick={() =>
            onOpenDetailViewClick && onOpenDetailViewClick(props.rawData)
          }
        >
          View
        </Button>
      </>
    );
  };

  return flattenedRows.length > 0 ? (
    <DataTable size="small" value={flattenedRows}>
      {renderColumns(resources?.[0]?.resourceType)}
    </DataTable>
  ) : (
    <p>No data</p>
  );
};

export default ResourceTable;
