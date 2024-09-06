import React, {useEffect, useState} from 'react';
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
import FormInput from "../../components/FormInput.jsx";
import FormSelect from "../../components/FormSelect.jsx";
import FormTextArea from "../../components/FormTextArea.jsx";
import {getSelectOptions, getUserSelectOptions} from "../../utils/commonUtils.js";
import {PlusCircleIcon} from "@heroicons/react/24/outline/index.js";
import SearchBar from "../../components/SearchBar.jsx";

const TestSuiteEditComponent = ({isOpen, onClose}) => {
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

        const handleTestCaseSearch = (term) => {
            // if (term.trim() === '') {
            //     setFilteredTestPlans(testPlans);
            // } else {
            //     const filtered = testPlans.filter(tp =>
            //         tp?.name.toLowerCase().includes(term.toLowerCase())
            //     );
            //     setFilteredTestPlans(filtered);
            // }
        };

        return (
            <>
                {isOpen && (
                    <form className="flex-col">
                        <div className="flex-col mb-8">
                            <div className={"flex justify-between items-center mb-4"}>
                                <p className={"text-secondary-grey font-bold text-lg"}>Test Suite Edit</p>
                                <button
                                    type="submit"
                                    className="px-8 py-2 bg-primary-pink text-white rounded hover:bg-pink-600 cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed"
                                    disabled={isSubmitting}
                                >
                                    Save
                                </button>
                            </div>
                            <div className="space-y-4 flex-col bg-white p-4 rounded-md">
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
                                    <div className={"flex-col w-1/4"}>
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
                                    <div className={"flex-col w-1/4"}>
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
                            </div>
                        </div>
                        <div className="flex-col mb-8">
                            <div className={"flex gap-10 items-center mb-4"}>
                                <p className={"text-secondary-grey font-bold text-lg"}>Platform</p>
                                <div className={"flex gap-1 items-center mr-5 cursor-pointer"}>
                                    <PlusCircleIcon className={"w-6 h-6 text-pink-500"}/>
                                    <span className="font-thin text-xs text-gray-600">Add New</span>
                                </div>
                            </div>
                            <div className="py-4 flex-col bg-white p-4 rounded-md">
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
                        </div>
                        <div className="flex-col mb-8">
                            <div className={"flex gap-5 items-center mb-4"}>
                                <p className={"text-secondary-grey font-bold text-lg"}>Test Cases</p>
                                <div className={"flex gap-1 items-center mr-5 cursor-pointer"}>
                                    <PlusCircleIcon className={"w-6 h-6 text-pink-500"}/>
                                    <span className="font-thin text-xs text-gray-600">Add New</span>
                                </div>
                                <SearchBar onSearch={handleTestCaseSearch}/>
                            </div>
                            <div className="py-4 flex-col bg-white p-4 rounded-md">
                            </div>
                        </div>
                    </form>
                )
                }
            </>
        )
            ;
    }
;

export default TestSuiteEditComponent;
