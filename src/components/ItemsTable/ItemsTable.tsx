import { FhirResource } from "../../interfaces";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import "./ItemsTable.scss";
import { Button } from "primereact/button";

export interface TableProps {
  items: Array<FlattenedRow>;
  columns: Array<string>;
  onDetailViewClick?: (data: FlattenedRow) => void;
}

export interface FlattenedRow {
  rawData: FhirResource[];
  [key: string]:
    | {
        value: string | number | null | undefined;
        body: string | JSX.Element | null | undefined;
      }
    | FhirResource[];
}

const ItemsTable = ({
  columns,
  items,
  onDetailViewClick: onOpenDetailViewClick,
}: TableProps) => {
  const renderColumns = () => {
    const columnsEl: JSX.Element[] = [];

    columns.forEach((label, i) => {
      const field = label.replace(/ /g, "");
      columnsEl.push(
        <Column
          sortable
          key={"Column_" + i}
          field={`${field}.value`}
          header={label}
          body={(r) => {
            if (r?.hasOwnProperty(field)) {
              return r[field].body ?? r[field].value;
            }
            return "";
          }}
        />
      );
    });

    columnsEl.push(
      <Column
        key={"Column_ActionButton"}
        header="Actions"
        body={renderActionButton}
        sortable={false}
      />
    );

    return columnsEl;
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
