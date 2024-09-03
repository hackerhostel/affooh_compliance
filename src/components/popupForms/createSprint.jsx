import React from 'react';
import FormInput from "../../components/FormInput.jsx";

const CreateSprintPopup = ({
  createSprintDetails,
  handleFormChange,
  formErrors,
  isValidationErrorsShown,
  handleFormSubmit,
  handleClosePopup
}) => {
  return (
    <div style={popupStyles}>
      <button onClick={handleClosePopup} style={closeButtonStyles}>Close</button>
      <span className='text-3xl'>Create New Sprint</span>
      <form onSubmit={handleFormSubmit}>
        <div className='ml-2, mt-4'>
          <FormInput
            type="text"
            name="sprintName"
            formValues={createSprintDetails}
            placeholder="Sprint Name"
            onChange={({ target: { name, value } }) => handleFormChange(name, value)}
            formErrors={formErrors}
            showErrors={isValidationErrorsShown}
          />
        </div>

        <div className='flex gap-1 mt-5'>
          <div>
            <FormInput
              type="date"
              name="startDate"
              formValues={createSprintDetails}
              placeholder="Start Date"
              onChange={({ target: { name, value } }) => handleFormChange(name, value)}
              formErrors={formErrors}
              showErrors={isValidationErrorsShown}
              style={{ width: '352px' }}
            />
          </div>
          <div>
            <FormInput
              type="date"
              name="endDate"
              formValues={createSprintDetails}
              placeholder="End Date"
              onChange={({ target: { name, value } }) => handleFormChange(name, value)}
              formErrors={formErrors}
              showErrors={isValidationErrorsShown}
              style={{ width: '392px' }}
            />
          </div>
        </div>

        <br />
        <div className='flex mt-80 gap-5 ml-6'>
          <input
            type="button"
            value="Cancel"
            className="w-full py-3 rounded-lg text-black font-bold cursor-pointer"
            style={{
              width: '205px',
              borderColor: 'rgba(116, 122, 136, 1)',
              borderWidth: '2px',
              borderStyle: 'solid',
              color: 'rgba(116, 122, 136, 1)'
            }}
            onClick={handleClosePopup}
          />

          <input
            type="submit"
            value="Create New Sprint"
            className="py-3 rounded-lg bg-primary-pink text-white font-bold cursor-pointer"
            style={{ width: '484px' }}
          />
        </div>
      </form>
    </div>
  );
};

const popupStyles = {
  position: 'fixed',
  top: '420px',
  right: '0',
  transform: 'translateY(-50%)',
  width: '797px',
  height: '840px',
  padding: '20px',
  backgroundColor: '#fff',
  boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
  zIndex: 1000,
  borderRadius: '8px 0 0 8px',
};

const closeButtonStyles = {
  position: 'absolute',
  top: '10px',
  right: '10px',
  background: 'transparent',
  border: 'none',
  fontSize: '16px',
  cursor: 'pointer',
};

export default CreateSprintPopup;
