import { useContext, useState } from "react";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import "./App.scss";
import { Overlay, PatientCard, ResourceDetail } from "./components";
import { ResourceViewContainer } from "./containers/ResourceViewContainer";
import { FhirContext } from "./contexts/FhirContext";
import { Layout } from "./ui/Layout";
import { PrescriptionsViewContainer } from "./containers/PrescriptionsViewContainer";

const App = () => {
  const {
    fhirResources,
    patients,
    isLoading: isLoadingResources,
  } = useContext(FhirContext);

  const [selectedResource, setSelectedResource] = useState<any>(null);

  const hasFhirResources = fhirResources && fhirResources.length > 0;

  const onCloseDetail = () => {
    setSelectedResource(null);
  };

  const onResourceClickHandler = (resourceId: string) => {
    const resource = fhirResources.find((f) => f.id === resourceId);
    setSelectedResource(JSON.stringify(resource, null, 4));
  };

  const onOpenDetailViewClickHandler = (data: any) => {
    setSelectedResource(JSON.stringify(data, null, 4));
  };

  const hasData = hasFhirResources;
  const isLoading = isLoadingResources;

  return (
    <>
      <Router>
        <Layout>
          {isLoading && <Overlay showLoading />}
          {!isLoading && hasData && (
            <>
              <div>
                <PatientCard
                  patients={patients}
                  onDetailViewClick={onOpenDetailViewClickHandler}
                />

                <Routes>
                  {" "}
                  <Route
                    path="/Prescriptions"
                    element={
                      <PrescriptionsViewContainer
                        onOpenDetailViewClick={onOpenDetailViewClickHandler}
                      />
                    }
                  />
                  <Route
                    path="/Resources/:resourceType?"
                    element={
                      <ResourceViewContainer
                        onOpenDetailViewClick={onOpenDetailViewClickHandler}
                      />
                    }
                  />
                  <Route
                    path="/"
                    element={<Navigate to="/Resources" replace={true} />}
                  />
                </Routes>
              </div>
            </>
          )}
        </Layout>
        <ResourceDetail
          selectedResource={selectedResource}
          resources={fhirResources}
          onCloseDetail={onCloseDetail}
          onResourceClick={onResourceClickHandler}
        />
      </Router>
    </>
  );
};

export default App;
