import React, { useState } from 'react';
import MainPageLayout from '../../layouts/MainPageLayout.jsx';
import SprintListPage from "./SprintListPage.jsx";
import SprintContentPage from "./SprintContentPage.jsx";
import CreateSprintPopup from '../../components/popupForms/createSprint.jsx';
import { SprintSchema } from '../../state/domains/authModels.js';
import { PlusCircleIcon } from "@heroicons/react/24/outline/index.js";

const SprintLayout = () => {
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [createSprintDetails, setCreateSprintDetails] = useState({
    sprintName: '',
    startDate: '',
    endDate: '',
  });
  const [formErrors, setFormErrors] = useState({});
  const [isValidationErrorsShown, setIsValidationErrorsShown] = useState(false);

  const handleFormChange = (name, value) => {
    setCreateSprintDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const validateForm = async () => {
    try {
      await SprintSchema.validate(createSprintDetails, { abortEarly: false });
      setFormErrors({});
      return true;
    } catch (validationErrors) {
      const errors = {};
      validationErrors.inner.forEach(error => {
        errors[error.path] = error.message;
      });
      setFormErrors(errors);
      setIsValidationErrorsShown(true);
      return false;
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const isValid = await validateForm();
    if (!isValid) return;

    // Add logic to handle form submission (e.g., API call, Redux action)
    console.log('Sprint created successfully:', createSprintDetails);

    // Close popup and reset form
    setPopupVisible(false);
    setCreateSprintDetails({
      sprintName: '',
      startDate: '',
      endDate: '',
    });
    setIsValidationErrorsShown(false);
  };

  const handleAddNewClick = () => {
    setPopupVisible(true);
  };

  const handleClosePopup = () => {
    setPopupVisible(false);
  };

  return (
    <MainPageLayout
      title={"Sprints"}
      onAction={handleAddNewClick}
      subText={"Add New"}
      leftColumn={<SprintListPage />}
      rightColumn={
        <div className={"bg-dashboard-bgc"}>
          <SprintContentPage />
          {isPopupVisible && (
            <CreateSprintPopup
              createSprintDetails={createSprintDetails}
              handleFormChange={handleFormChange}
              formErrors={formErrors}
              isValidationErrorsShown={isValidationErrorsShown}
              handleFormSubmit={handleFormSubmit}
              handleClosePopup={handleClosePopup}
            />
          )}
        </div>
      }
    />
  );
};

export default SprintLayout;
