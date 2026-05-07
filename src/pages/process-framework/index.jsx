import React, { useState } from "react";
import { useSelector } from "react-redux";
import MainPageLayout from "../../layouts/MainPageLayout.jsx";
import { selectUser } from "../../state/slice/authSlice.js";
import ProcessContentPage from "./ProcessContentPage.jsx";
import ProcessListPage from "./ProcessListPage.jsx";

const ProcessFrameWorkLayout = () => {
  const user = useSelector(selectUser);
  const organizationID = user?.organization?.id || user?.organizationID || user?.organizationId;

  const [selectedType, setSelectedType] = useState("POLICY");
  const [addNewTrigger, setAddNewTrigger] = useState(0);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  return (
    <MainPageLayout
      title="Process framework"
      subText="Add New"
      leftColumn={
        <ProcessListPage
          selectedType={selectedType}
          onTypeChange={setSelectedType}
        />
      }
      rightColumn={
        <ProcessContentPage
          organizationID={organizationID}
          currentUser={user}
          selectedType={selectedType}
          addNewTrigger={addNewTrigger}
          refreshTrigger={refreshTrigger}
          onRefresh={() => setRefreshTrigger((prev) => prev + 1)}
        />
      }
      onAction={() => setAddNewTrigger((prev) => prev + 1)}
    />
  );
};

export default ProcessFrameWorkLayout;
