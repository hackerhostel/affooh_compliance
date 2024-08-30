import React, {useEffect, useState} from 'react';
import {XMarkIcon} from "@heroicons/react/24/outline";
import FormInput from "../../components/FormInput.jsx";
import FormSelect from "../../components/FormSelect.jsx";
import {getSelectOptions, getUserSelectOptions} from "../../utils/commonUtils.js";
import {useToasts} from "react-toast-notifications";
import {useDispatch, useSelector} from "react-redux";
import {TestSuiteCreateSchema} from "../../utils/validationSchemas.js";
import useValidation from "../../utils/use-validation.jsx";
import {selectSelectedProject} from "../../state/slice/projectSlice.js";
import {selectSelectedTestPlan} from "../../state/slice/testPlansSlice.js";
import {selectProjectUserList} from "../../state/slice/projectUsersSlice.js";
import {selectReleaseListForProject} from "../../state/slice/releaseSlice.js";
import {selectTestCaseStatuses} from "../../state/slice/testCaseFormDataSlice.js";
import {doGetPlatforms, selectPlatformList} from "../../state/slice/platformSlice.js";
import FormTextArea from "../../components/FormTextArea.jsx";

const TestSuiteCreateComponent = ({isOpen, onClose}) => {
    const {addToast} = useToasts();
    const dispatch = useDispatch();

    const selectedProject = useSelector(selectSelectedProject);
    const selectedTestPlan = useSelector(selectSelectedTestPlan);
    const projectUserList = useSelector(selectProjectUserList);
    const testCaseStatuses = useSelector(selectTestCaseStatuses);
    const releases = useSelector(selectReleaseListForProject)
    const platforms = useSelector(selectPlatformList);

    useEffect(() => {
        if (!platforms.length) {
            dispatch(doGetPlatforms())
        }
    }, [platforms]);

    const [formValues, setFormValues] = useState({
        summary: '',
        description: '',
        status: '',
        assignee: '',
        releases: [],
        build: '',
        platforms: [],
        testCases: [],
        projectId: selectedProject.id,
        testPlanId: selectedTestPlan.id
    });

    const [isValidationErrorsShown, setIsValidationErrorsShown] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formErrors] = useValidation(TestSuiteCreateSchema, formValues);

    const handleFormChange = (name, value, isText) => {
        setFormValues({...formValues, [name]: isText ? value : value});
        setIsValidationErrorsShown(false);
    };

    const handleClose = () => {
        onClose();
        setFormValues({
            summary: '',
            description: '',
            status: '',
            assignee: '',
            releases: [],
            build: '',
            platforms: [],
            testCases: [],
            projectId: selectedProject.id,
            testPlanId: selectedTestPlan.id
        });
        setIsValidationErrorsShown(false);
    };

    const createTestSuite = async (event) => {
        event.preventDefault();
        console.log(formValues)
        // setIsSubmitting(true);
        //
        // if (formErrors && Object.keys(formErrors).length > 0) {
        //     setIsValidationErrorsShown(true);
        // } else {
        //     setIsValidationErrorsShown(false);
        //     try {
        //         await axios.post("/test-plans/test-suites", {testSuite:formValues});
        //         addToast('Test Suite Successfully Created', {appearance: 'success'});
        //         handleClose();
        //     } catch (error) {
        //         addToast('Failed to create Test Suite', {appearance: 'error'});
        //     }
        // }
        // setIsSubmitting(false);
    };

    return (
        <>
            {isOpen && (
                <div className="fixed inset-0 flex items-right justify-end bg-white bg-opacity-25 backdrop-blur-sm">
                    <div className="bg-white p-6 shadow-lg w-1/2">
                        <div className="flex justify-between items-center mb-4">
                            <p className="font-bold text-2xl">New Test Suite</p>
                            <div className="cursor-pointer" onClick={handleClose}>
                                <XMarkIcon className="w-6 h-6 text-gray-500"/>
                            </div>
                        </div>
                        <form className={"flex flex-col justify-between h-5/6 mt-10"} onSubmit={createTestSuite}>
                            <div className="space-y-4">
                                <div className={"flex-col"}>
                                    <p className={"text-secondary-grey"}>Summary</p>
                                    <FormInput
                                        type="text"
                                        name="summary"
                                        formValues={formValues}
                                        onChange={({target: {name, value}}) => handleFormChange(name, value, true)}
                                        formErrors={formErrors}
                                        showErrors={isValidationErrorsShown}
                                    />
                                </div>
                                <div className={"flex-col"}>
                                    <p className={"text-secondary-grey"}>Description</p>
                                    <FormTextArea
                                        name="description"
                                        formValues={formValues}
                                        onChange={({target: {name, value}}) => handleFormChange(name, value, true)}
                                        formErrors={formErrors}
                                        showErrors={isValidationErrorsShown}
                                    />
                                </div>
                                <div className={"flex w-full justify-between gap-10"}>
                                    <div className={"flex-col w-2/4"}>
                                        <p className={"text-secondary-grey"}>Status</p>
                                        <FormSelect
                                            name="status"
                                            formValues={formValues}
                                            options={getSelectOptions(testCaseStatuses)}
                                            onChange={({target: {name, value}}) => handleFormChange(name, value, false)}
                                            formErrors={formErrors}
                                            showErrors={isValidationErrorsShown}
                                        />
                                    </div>
                                    <div className={"flex-col w-2/4"}>
                                        <p className={"text-secondary-grey"}>Associated Release(s)</p>
                                        <FormSelect
                                            name="releases"
                                            formValues={formValues}
                                            options={getSelectOptions(releases)}
                                            onChange={({target: {name, value}}) => handleFormChange(name, value, false)}
                                            formErrors={formErrors}
                                            showErrors={isValidationErrorsShown}
                                        />
                                    </div>
                                </div>
                                <div className={"flex w-full justify-between gap-10"}>
                                    <div className={"flex-col w-2/4"}>
                                        <p className={"text-secondary-grey"}>Assignee</p>
                                        <FormSelect
                                            name="assignee"
                                            formValues={formValues}
                                            options={getUserSelectOptions(projectUserList)}
                                            onChange={({target: {name, value}}) => handleFormChange(name, value, false)}
                                            formErrors={formErrors}
                                            showErrors={isValidationErrorsShown}
                                        />
                                    </div>
                                    <div className={"flex-col w-2/4"}>
                                        <p className={"text-secondary-grey"}>Build Name</p>
                                        <FormInput
                                            type="text"
                                            name="build"
                                            formValues={formValues}
                                            onChange={({target: {name, value}}) => handleFormChange(name, value, true)}
                                            formErrors={formErrors}
                                            showErrors={isValidationErrorsShown}
                                        />
                                    </div>
                                </div>
                                <div className={"flex-col"}>
                                    <p className={"text-secondary-grey"}>Platforms</p>
                                    <FormSelect
                                        name="platforms"
                                        formValues={formValues}
                                        options={getSelectOptions(platforms)}
                                        onChange={({target: {name, value}}) => handleFormChange(name, value, false)}
                                        formErrors={formErrors}
                                        showErrors={isValidationErrorsShown}
                                    />
                                </div>
                            </div>
                            <div className="flex space-x-4 mt-6 self-end w-full">
                                <button
                                    onClick={handleClose}
                                    className="px-4 py-2 text-gray-700 rounded w-1/4 border border-black cursor-pointer disabled:cursor-not-allowed"
                                    disabled={isSubmitting}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-primary-pink text-white rounded hover:bg-pink-600 w-3/4 cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed"
                                    disabled={isSubmitting}
                                >
                                    Create
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default TestSuiteCreateComponent;
