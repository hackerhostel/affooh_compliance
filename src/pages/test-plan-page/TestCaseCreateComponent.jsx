import React, {useState} from 'react';
import {XMarkIcon} from "@heroicons/react/24/outline";
import FormInput from "../../components/FormInput.jsx";
import FormSelect from "../../components/FormSelect.jsx";
import {getSelectOptions} from "../../utils/commonUtils.js";
import {useToasts} from "react-toast-notifications";
import {useDispatch, useSelector} from "react-redux";
import {TestCaseCreateSchema} from "../../utils/validationSchemas.js";
import useValidation from "../../utils/use-validation.jsx";
import {selectSelectedProject} from "../../state/slice/projectSlice.js";
import {
    selectTestCaseCategories,
    selectTestCasePriorities,
    selectTestCaseStatuses
} from "../../state/slice/testCaseFormDataSlice.js";
import FormTextArea from "../../components/FormTextArea.jsx";
import Select from 'react-select';
import useFetchFlatTasks from "../../hooks/custom-hooks/task/useFetchFlatTasks.jsx";
import SkeletonLoader from "../../components/SkeletonLoader.jsx";

const TestCaseCreateComponent = ({isOpen, onClose}) => {
    const {addToast} = useToasts();
    const dispatch = useDispatch();

    const selectedProject = useSelector(selectSelectedProject);
    const testCaseStatuses = useSelector(selectTestCaseStatuses);
    const testCasePriorities = useSelector(selectTestCasePriorities);
    const testCaseCategories = useSelector(selectTestCaseCategories);

    const {loading, data: tasks} = useFetchFlatTasks(selectedProject?.id)

    const [formValues, setFormValues] = useState({
        summary: '',
        description: '',
        status: '',
        projectId: selectedProject.id,
        priority: 0,
        category: 0,
        estimate: '',
        steps: [],
        requirements: []
    });

    const [isValidationErrorsShown, setIsValidationErrorsShown] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formErrors] = useValidation(TestCaseCreateSchema, formValues);

    const handleMultiSelect = (selectedOptions, actionMeta) => {
        const {name} = actionMeta;
        if (selectedOptions.length) {
            setFormValues({...formValues, [name]: selectedOptions.map(sp => (sp.value))})
        } else {
            setFormValues({...formValues, [name]: []})
        }
        setIsValidationErrorsShown(false);
    };

    const handleFormChange = (name, value, isText) => {
        setFormValues({...formValues, [name]: isText ? value : Number(value)});
        setIsValidationErrorsShown(false);
    };

    const handleClose = (created = false) => {
        onClose(created);
        setFormValues({
            summary: '',
            description: '',
            status: '',
            projectId: selectedProject.id,
            priority: 0,
            category: 0,
            estimate: '',
            steps: [],
            requirements: []
        });
        setIsValidationErrorsShown(false);
    };

    const createTestCase = async (event) => {
        event.preventDefault();
        console.log(formValues);
        // setIsSubmitting(true);
        //
        // if (formErrors && Object.keys(formErrors).length > 0) {
        //     setIsValidationErrorsShown(true);
        //     let warningMsg = '';
        //
        //     if (formErrors?.releases && formErrors.releases.length > 0) {
        //         warningMsg += '\n' + formErrors.releases[0];
        //     }
        //     if (formErrors?.platforms && formErrors.platforms.length > 0) {
        //         warningMsg += '\n' + formErrors.platforms[0];
        //     }
        //     if (formErrors?.testCases && formErrors.testCases.length > 0) {
        //         warningMsg += '\n' + formErrors.testCases[0];
        //     }
        //
        //     if (warningMsg.trim() !== '') {
        //         addToast(warningMsg.trim(), {appearance: 'warning', placement: 'top-right'});
        //     }
        // } else {
        //     setIsValidationErrorsShown(false);
        //     try {
        //         formValues.testPlanId = selectedTestPlan.id
        //         await axios.post("/test-plans/test-suites", {testSuite: formValues});
        //         addToast('Test Suite Successfully Created', {appearance: 'success'});
        //         handleClose(true);
        //     } catch (error) {
        //         console.log(error)
        //         addToast('Failed to create Test Suite', {appearance: 'error'});
        //     }
        // }

        // setIsSubmitting(false);
    };

    return (
        <>
            {isOpen && (
                <div className="fixed inset-0 flex items-right justify-end bg-white bg-opacity-25 backdrop-blur-sm">
                    <div className="bg-white p-5 shadow-lg w-1/2 h-screen overflow-y-auto">
                        {loading ? (
                            <div className="m-10"><SkeletonLoader/></div>
                        ) : (
                            <>
                                <div className="flex justify-between items-center">
                                    <p className="font-bold text-2xl">New Test Case</p>
                                    <div className="cursor-pointer" onClick={handleClose}>
                                        <XMarkIcon className="w-6 h-6 text-gray-500"/>
                                    </div>
                                </div>
                                <form className={"flex flex-col justify-between mt-5"} onSubmit={createTestCase}>
                                    <div className="space-y-3">
                                        <div className={"flex-col"}>
                                            <p className={"text-secondary-grey"}>Summary</p>
                                            <FormTextArea
                                                name="summary"
                                                formValues={formValues}
                                                onChange={({target: {name, value}}) => handleFormChange(name, value, true)}
                                                formErrors={formErrors}
                                                showErrors={isValidationErrorsShown}
                                                rows={4}
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
                                                rows={4}
                                            />
                                        </div>
                                        <div className={"flex w-full justify-between gap-10"}>
                                            <div className={"flex-col w-2/4"}>
                                                <p className={"text-secondary-grey"}>Priority</p>
                                                <FormSelect
                                                    name="priority"
                                                    formValues={formValues}
                                                    options={testCasePriorities && testCasePriorities.length ? getSelectOptions(testCasePriorities) : []}
                                                    onChange={({target: {name, value}}) => handleFormChange(name, value, false)}
                                                    formErrors={formErrors}
                                                    showErrors={isValidationErrorsShown}
                                                />
                                            </div>
                                            <div className={"flex-col w-2/4"}>
                                                <p className={"text-secondary-grey"}>Category</p>
                                                <FormSelect
                                                    name="category"
                                                    formValues={formValues}
                                                    options={testCaseCategories && testCaseCategories.length ? getSelectOptions(testCaseCategories) : []}
                                                    onChange={({target: {name, value}}) => handleFormChange(name, value, false)}
                                                    formErrors={formErrors}
                                                    showErrors={isValidationErrorsShown}
                                                />
                                            </div>
                                            <div className={"flex-col w-2/4"}>
                                                <p className={"text-secondary-grey"}>Estimate</p>
                                                <FormInput
                                                    type="text"
                                                    name="estimate"
                                                    formValues={formValues}
                                                    onChange={({target: {name, value}}) => handleFormChange(name, value, true)}
                                                    formErrors={formErrors}
                                                    showErrors={isValidationErrorsShown}
                                                />
                                            </div>
                                        </div>
                                        <div className={"flex-col"}>
                                            <p className={"text-secondary-grey mb-2"}>Requirements</p>
                                            <Select
                                                name="requirements"
                                                defaultValue={formValues.requirements}
                                                onChange={handleMultiSelect}
                                                options={tasks && tasks.length ? getSelectOptions(tasks) : []}
                                                isMulti
                                                menuPlacement='top'
                                                closeMenuOnSelect={false}
                                                hideSelectedOptions={true}
                                                allowSelectAll
                                                isSearchable={true}
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
                            </>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default TestCaseCreateComponent;
