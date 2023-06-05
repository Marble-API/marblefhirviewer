import { TableColumnConfig } from "../../interfaces";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import "./ItemsTable.scss";
import { Button } from "primereact/button";

export interface TableProps {
  columnsConfig: Array<TableColumnConfig>;
  items: Array<FlattenedRow>;
  onDetailViewClick?: (data: any) => void;
}

export interface FlattenedRow {
  [key: string]: {
    value: any;
    body: string | JSX.Element | null | undefined;
  };
}

const ItemsTable = ({
  columnsConfig,
  items,
  onDetailViewClick: onOpenDetailViewClick,
}: TableProps) => {
  const renderColumns = () => {
    const columns: JSX.Element[] = [];

    columnsConfig.forEach((config, i) => {
      const field = config.label.replace(/ /g, "");
      columns.push(
        <Column
          sortable
          key={"Column_" + i}
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
        key={"Column_ActionButton"}
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

  return items.length > 0 ? (
    <DataTable size="small" value={items}>
      {renderColumns()}
    </DataTable>
  ) : (
    <p>No data</p>
  );
};

export default ItemsTable;
