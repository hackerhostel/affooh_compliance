import React from "react";
import FormSelect from "../../FormSelect.jsx";
import FormInput from "../../FormInput.jsx";
import FormInputWrapper from "./FormEditInputWrapper.jsx";
import {getSelectOptions, getUserSelectOptions} from "../../../utils/commonUtils.js";
import {useToasts} from "react-toast-notifications";

const EditScreenTabField = ({
                                isEditing,
                                field,
                                onChange,
                                initialAttributeData = [],
                                isValidationErrorsShown,
                                updateTaskAttribute,
                                tabName,
                                users,
                                taskAttributes = []
                            }) => {
    const {addToast} = useToasts();

    const handleChange = (value) => {
        onChange(field.id, value);
    };

    const updateAttributes = (value) => {
        if (tabName === "General") {
            updateTaskAttribute(field.id, value);
        } else {
            addToast(`Under Development!`, {appearance: 'warning'});
        }
    }

    const getErrorMessage = () => {
        const filteredTaskAttribute = initialAttributeData.find(ta => ta?.taskFieldID === field.id)
        if (field.required === 1 && filteredTaskAttribute.values.length === 0) {
            return `${field.name} is required`;
        }

        return undefined
    };

    const getInitialFormValue = (name) => {
        const filteredTaskAttribute = initialAttributeData.find(ta => ta?.taskFieldName === name)
        return {[name]: filteredTaskAttribute ? filteredTaskAttribute.values[0] : ''}
    }

    const getFormValue = (name) => {
        const filteredTaskAttribute = taskAttributes.find(ta => ta?.taskFieldName === name)
        return {[name]: filteredTaskAttribute ? filteredTaskAttribute.values[0] : ''}
    }

    const setToInitialValue = () => {
        const filteredTaskAttribute = initialAttributeData.find(ta => ta?.taskFieldID === field.id)
        handleChange(filteredTaskAttribute.values[0])
    }

    const onAttributeAccept = () => {
        const filteredTaskAttribute = taskAttributes.find(ta => ta?.taskFieldID === field.id)
        updateAttributes(filteredTaskAttribute.values[0])
    }

    const renderField = () => {
        const errorMessage = getErrorMessage();
        const commonProps = {
            name: field.name,
            formErrors: errorMessage ? {[field.name]: errorMessage} : {},
            showErrors: isValidationErrorsShown,
        };

        switch (field.fieldType.name) {
            case "DDL":
            case "MULTI_SELECT":
            case "TASK_PICKER_MULTI_SELECT": // TODO: need to remove task list comes with response
            case "TASK_PICKER":
            case "RELEASE_PICKER":
                return (
                    <FormSelect
                        {...commonProps}
                        showLabel
                        disabled={isEditing}
                        formValues={getFormValue(field?.name)}
                        placeholder={field.name}
                        options={getSelectOptions(field?.fieldValues && field.fieldValues.length ? field?.fieldValues : [])}
                        isMulti={field.fieldType.canSelectMultiValues === 1}
                        onChange={({target: {value}}) => {
                            handleChange(value)
                            updateAttributes(value)
                        }}
                    />
                );
            case "USER_PICKER":
                return (
                    <FormSelect
                        {...commonProps}
                        disabled={isEditing}
                        showLabel
                        formValues={getFormValue(field?.name)}
                        placeholder={field.name}
                        options={users.length ? getUserSelectOptions(users) : []}
                        isMulti={field.fieldType.canSelectMultiValues === 1}
                        onChange={({target: {value}}) => {
                            handleChange(value)
                            updateAttributes(value)
                        }}
                    />
                );
            case "DATE_PICKER":
                return (
                    <FormInputWrapper
                        isEditing={isEditing}
                        initialData={getInitialFormValue(field?.name)}
                        currentData={getFormValue(field?.name)}
                        onAccept={onAttributeAccept}
                        onReject={setToInitialValue}
                        actionButtonPlacement={"bottom"}
                    >
                        <FormInput
                            {...commonProps}
                            formValues={getFormValue(field?.name)}
                            type="date"
                            placeholder={field.name}
                            onChange={({target: {value}}) => handleChange(value)}
                        />
                    </FormInputWrapper>
                );
            case "TEXT":
            default:
                return (
                    <FormInputWrapper
                        isEditing={isEditing}
                        initialData={getInitialFormValue(field?.name)}
                        currentData={getFormValue(field?.name)}
                        onAccept={onAttributeAccept}
                        onReject={setToInitialValue}
                        actionButtonPlacement={"bottom"}
                    >
                        <FormInput
                            {...commonProps}
                            formValues={getFormValue(field?.name)}
                            type="text"
                            placeholder={field.name}
                            onChange={({target: {value}}) => handleChange(value)}
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