import { useEffect, useState } from "react";
import { Sidebar } from "primereact/sidebar";
import { Button } from "primereact/button";
import { ResourceVisualizer } from "../ResourceVisualizer";
import "./ResourceDetail.scss";

interface ResourceDetailProps {
  selectedResource: any;
  resources: Array<any>;
  onResourceClick: (resourceId: string) => void;
  onCloseDetail: () => void;
}

const ResourceDetail = ({
  selectedResource,
  resources,
  onResourceClick,
  onCloseDetail,
}: ResourceDetailProps) => {
  const [displayJson, setDisplayJson] = useState<boolean>(false);

  useEffect(() => {
    setDisplayJson(false);
  }, [selectedResource]);

  const onClose = () => {
    onCloseDetail();
  };

  const displayJsonClick = () => {
    setDisplayJson(!displayJson);
  };

  return (
    <Sidebar
      style={{ width: "800px" }}
      className="detail-view"
      visible={!!selectedResource}
      position="right"
      onHide={onClose}
    >
      <div>
        <Button type="button" onClick={displayJsonClick}>
          {displayJson ? "View as Table" : "View as JSON"}
        </Button>
      </div>
      {!displayJson && selectedResource ? (
        <ResourceVisualizer
          selectedResource={selectedResource}
          resources={resources}
          onResourceClick={onResourceClick}
        />
      ) : (
        <pre>{selectedResource}</pre>
      )}
    </Sidebar>
  );
};

export default ResourceDetail;
