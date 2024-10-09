import React, { useState } from 'react';
import MainPageLayout from '../../layouts/MainPageLayout.jsx';
import ReleaseListPage from "./ReleaseListPage.jsx";
import ReleaseContentPage from "./ReleaseContentPage.jsx";

const ReleaseLayout = () => {
 

  return (
    <MainPageLayout
      title={
        "add new"
      }
      leftColumn={<ReleaseListPage />}
      rightColumn={<ReleaseContentPage />}
    />
  );
};

export default ReleaseLayout;
