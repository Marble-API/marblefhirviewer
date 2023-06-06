import { useCallback, useContext, useEffect, useState } from "react";
import { ItemsTable } from "../../components";
import { FhirContext } from "../../contexts/FhirContext";
import "./PrescriptionsViewContainer.scss";
import { PrescriptionTableColumnConfig } from "../../dataMapping/PrescriptionTableColumnConfig";
import { FhirResource, TableColumnConfig } from "../../interfaces";
import { FlattenedRow } from "../../components/ItemsTable/ItemsTable";
import { findReferenceResource } from "../../functions/FhirFunctions";

interface PrescriptionsViewContainerProps {
  onOpenDetailViewClick: (data: FlattenedRow) => void;
}

const PrescriptionsViewContainer = ({
  onOpenDetailViewClick,
}: PrescriptionsViewContainerProps) => {
  const { fhirResources } = useContext(FhirContext);
  const [flattenedRows, setFlattenedRows] = useState<Array<FlattenedRow>>([]);

  const flattenRows = useCallback(
    (
      resources: Array<FhirResource>,
      columnsConfig: Array<TableColumnConfig>,
      allResources: Array<FhirResource>
    ) => {
      const rows = resources.map((resource) => {
        // While this is not necessary, if it nice to have all associated resources on rawData
        const linkedResources: Array<FhirResource> = [];
        if (resource.medicationReference) {
          const medication = findReferenceResource(
            resource.medicationReference,
            allResources
          );
          if (medication) {
            linkedResources.push(medication);
          }
        }

        if (resource.performer.length > 0) {
          resource.performer.forEach((f: any) => {
            const performer = findReferenceResource(f.actor, allResources);
            if (performer) {
              linkedResources.push(performer);
            }
          });
        }

        const columns = columnsConfig.reduce<FlattenedRow>(
          (prev, column) => {
            const value = column.getValue(resource, linkedResources);
            const body = column.renderer
              ? column.renderer(resource, linkedResources)
              : null;
            prev[column.label.replace(/ /g, "")] = {
              value,
              body,
            };
            return prev;
          },
          { rawData: [resource, ...linkedResources] }
        );

        return columns;
      });

      setFlattenedRows(rows);
    },
    []
  );

  useEffect(() => {
    const filteredResources = fhirResources.filter(
      (f) => f.resourceType === "MedicationDispense"
    );

    flattenRows(
      filteredResources,
      PrescriptionTableColumnConfig,
      fhirResources
    );
  }, [fhirResources, flattenRows]);

  return (
    <div className="viewer-wrapper">
      <div className="viewer-content">
        <ItemsTable
          columns={PrescriptionTableColumnConfig.map((m) => m.label)}
          items={flattenedRows}
          onDetailViewClick={onOpenDetailViewClick}
        />
      </div>
    </div>
  );
};

export default PrescriptionsViewContainer;
