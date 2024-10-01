import React, {useCallback} from "react";
import FormSelect from "../../FormSelect.jsx";
import FormInput from "../../FormInput.jsx";
import {useSelector} from "react-redux";
import {selectProjectUserList} from "../../../state/slice/projectUsersSlice.js";
import FormInputWrapper from "./FormEditInputWrapper.jsx";

const EditScreenTabField = ({
                              isEditing,
                              field,
                              formValues,
                              onChange,
                              initialTaskData,
                              isValidationErrorsShown,
                              updateTaskAttribute
                            }) => {
  const userListForProject = useSelector(selectProjectUserList);

  const handleChange = (name, value) => {
    const fieldValue = Array.isArray(value) ? value : [value];
    onChange({
      fieldTypeName: field.fieldType.name,
      fieldValue,
      taskFieldID: field.id
    });
  };

  const getErrorMessage = () => {
    if (field.required === 1 && (!formValues[field.id] || formValues[field.id].length === 0)) {
      return `${field.name} is required`;
    }

    return undefined
  };

  const renderField = () => {
    const errorMessage = getErrorMessage();
    const commonProps = {
      name: field.name,
      formErrors: errorMessage ? {[field.name]: errorMessage} : {},
      showErrors: isValidationErrorsShown,
    };

    const fieldValue = formValues[field.id]
      ? {[field.name]: formValues[field.id].fieldValue}
      : {[field.name]: ""};

    switch (field.fieldType.name) {
      case "DDL":
      case "MULTI_SELECT":
      case "TASK_PICKER_MULTI_SELECT": // TODO: need to remove task list comes with response
      case "TASK_PICKER":
        return (
          <FormSelect
            {...commonProps}
            showLabel
            disabled={isEditing}
            formValues={fieldValue}
            placeholder={field.name}
            options={field.fieldValues.map(fv => ({value: fv.id, label: fv.value}))}
            isMulti={field.fieldType.canSelectMultiValues === 1}
            onChange={({target: {name, value}}) => {
              handleChange(name, value)
              const fieldDetails = formValues[field.id]
              updateTaskAttribute(
                fieldDetails.taskFieldID,
                field.id,
                formValues[field.id].fieldValue[0]
              );
            }}
          />
        );
      case "USER_PICKER":
        return (
          <FormSelect
            {...commonProps}
            disabled={isEditing}
            showLabel
            formValues={fieldValue}
            placeholder={field.name}
            options={userListForProject.map(fv => ({value: fv.id, label: `${fv.firstName} ${fv.lastName}`}))}
            isMulti={field.fieldType.canSelectMultiValues === 1}
            onChange={({target: {name, value}}) => {
              const fieldDetails = formValues[field.id]
              updateTaskAttribute(
                fieldDetails.taskFieldID,
                field.id,
                formValues[field.id].fieldValue[0]
              );
              handleChange(name, value)
            }}
          />
        );
      case "DATE_PICKER":
        return (
          <FormInputWrapper
            isEditing={isEditing}
            initialData={initialTaskData}
            currentData={formValues}
            fieldId={field.id}
            onAccept={() => {
              const fieldDetails = formValues[field.id]
              updateTaskAttribute(
                fieldDetails.taskFieldID,
                field.id,
                formValues[field.id].fieldValue[0]
              );
            }}
            onReject={() => {
              handleChange(field.name, initialTaskData[field.id].fieldValue[0]);
            }}
          >
            <FormInput
              {...commonProps}
              formValues={fieldValue}
              type="date"
              placeholder={field.name}
              onChange={({target: {name, value}}) => handleChange(name, value)}
            />
          </FormInputWrapper>
        );
      case "TEXT":
      default:
        return (
          <FormInputWrapper
            isEditing={isEditing}
            initialData={initialTaskData}
            currentData={formValues}
            fieldId={field.id}
            onAccept={() => {
              const fieldDetails = formValues[field.id]
              updateTaskAttribute(
                fieldDetails.taskFieldID,
                field.id,
                formValues[field.id].fieldValue[0]
              );
            }}
            onReject={() => {
              handleChange(field.name, initialTaskData[field.id].fieldValue[0]);
            }}
          >
            <FormInput
              {...commonProps}
              formValues={fieldValue}
              type="text"
              placeholder={field.name}
              onChange={({target: {name, value}}) => handleChange(name, value)}
            />
          </FormInputWrapper>
        );
    }
  };

  return (
    <div className="mb-6">
      {renderField()}
    </div>
  );
};

export default EditScreenTabField;