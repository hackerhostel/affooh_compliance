import {useDispatch, useSelector} from "react-redux";
import React, {useEffect, useRef, useState} from "react";
import FormInput from "../../components/FormInput.jsx";
import FormSelect from "../../components/FormSelect.jsx";
import {selectProjectList, selectSelectedProject} from "../../state/slice/projectSlice.js";
import {PlusCircleIcon} from "@heroicons/react/24/outline/index.js";
import {doGetTestCaseFormData, selectTestCaseStatuses} from "../../state/slice/testCaseFormDataSlice.js";
import {selectSprintListForProject} from "../../state/slice/sprintSlice.js";
import {selectProjectUserList} from "../../state/slice/projectUsersSlice.js";
import {selectSelectedTestPlanId, setSelectedTestPlan} from "../../state/slice/testPlansSlice.js";
import axios from "axios";
import SkeletonLoader from "../../components/SkeletonLoader.jsx";
import ErrorAlert from "../../components/ErrorAlert.jsx";
import {
    doGetReleases,
    selectIsReleaseListForProjectError,
    selectIsReleaseListForProjectLoading,
    selectReleaseListForProject
} from "../../state/slice/releaseSlice.js";
import {useParams} from "react-router-dom";

const TestSuiteContentPage = () => {
    const dispatch = useDispatch();
    const {test_suite_id} = useParams();
    useEffect(() => {
        console.log("ti", test_suite_id)
    }, [test_suite_id]);

    const selectedTestPlanId = useSelector(selectSelectedTestPlanId);
    const selectedProject = useSelector(selectSelectedProject);
    const projects = useSelector(selectProjectList);
    const testCaseStatuses = useSelector(selectTestCaseStatuses);
    const sprintListForProject = useSelector(selectSprintListForProject);
    const projectUserList = useSelector(selectProjectUserList);
    const releases = useSelector(selectReleaseListForProject)
    const releaseLoading = useSelector(selectIsReleaseListForProjectLoading)
    const releaseError = useSelector(selectIsReleaseListForProjectError)

    const formRef = useRef(null);
    const [testPlan, setTestPlan] = useState({});
    const [formValues, setFormValues] = useState({id: 0, name: '', sprint: 0, project: 0, release: 0});
    const [formErrors, setFormErrors] = useState({});
    const [isValidationErrorsShown, setIsValidationErrorsShown] = useState(false);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    useEffect(() => {
        if (selectedProject?.id) {
            dispatch(doGetReleases(selectedProject?.id));
            dispatch(doGetTestCaseFormData(selectedProject?.id))
        }
    }, [selectedProject]);

    useEffect(() => {
        const fetchTestPlan = async () => {
            setLoading(true)
            setError(false)
            try {
                const response = await axios.get(`/test-plans/${selectedTestPlanId}`)
                const testPlanResponse = response?.data?.testPlan;

                if (testPlanResponse?.id) {
                    setLoading(false)
                    setFormValues({
                        id: testPlanResponse.id,
                        name: testPlanResponse.name,
                        sprint: testPlanResponse.sprintID,
                        project: testPlanResponse.projectID,
                        release: testPlanResponse.releaseID
                    })
                    setTestPlan(testPlanResponse)
                    dispatch(setSelectedTestPlan(testPlanResponse))
                }
            } catch (error) {
                setError(true)
                setLoading(false)
                console.error(error)
            }
        };

        if (selectedTestPlanId !== 0) {
            fetchTestPlan()
        }
    }, [selectedTestPlanId]);

    const getOptions = (options) => {
        return options.map(o => ({value: Number(o.id), label: o.name}));
    };

    const handleFormChange = (name, value) => {
        setFormValues({...formValues, [name]: value});
    };

    if (loading || releaseLoading) {
        return <div className="m-10"><SkeletonLoader/></div>;
    }

    if (error || releaseError) {
        return <ErrorAlert message={error.message}/>;
    }

    return (
        <div className={"p-7 bg-dashboard-bgc h-full"}>
            <div>
                <p className={"text-secondary-grey font-bold text-2xl mb-4"}>Test Execution List</p>
            </div>
            {!testPlan?.id ? (
                <div className="p-8 text-center">No Details Available, Please Select a Test plan </div>
            ) : (
                <div className={"flex-col"}>
                    <div className={"bg-white p-4 rounded-md"}>
                        <form className="flex justify-between" ref={formRef}>
                            <div className={"flex-col w-1/4"}>
                                <p className={"text-secondary-grey"}>Name</p>
                                <FormInput
                                    type="text"
                                    name="name"
                                    formValues={formValues}
                                    onChange={({target: {name, value}}) => handleFormChange(name, value)}
                                    formErrors={formErrors}
                                    showErrors={isValidationErrorsShown}
                                />
                            </div>
                            <div className={"flex-col w-1/4"}>
                                <p className={"text-secondary-grey"}>Sprint</p>
                                <FormSelect
                                    name="sprint"
                                    formValues={formValues}
                                    options={sprintListForProject.length ? getOptions(sprintListForProject) : []}
                                    onChange={({target: {name, value}}) => handleFormChange(name, value)}
                                />
                            </div>
                            <div className={"flex-col w-1/4"}>
                                <p className={"text-secondary-grey"}>Project</p>
                                <FormSelect
                                    name="project"
                                    formValues={formValues}
                                    options={projects.length ? getOptions(projects) : []}
                                    onChange={({target: {name, value}}) => handleFormChange(name, value)}
                                    disabled={true}
                                />
                            </div>
                            <div className={"flex-col w-1/5"}>
                                <p className={"text-secondary-grey"}>Release</p>
                                <FormSelect
                                    name="release"
                                    formValues={formValues}
                                    options={releases.length ? getOptions(releases) : []}
                                    onChange={({target: {name, value}}) => handleFormChange(name, value)}
                                />
                            </div>
                        </form>
                    </div>
                    <div className={"flex gap-8 mt-7 mb-3"}>
                        <p className={"text-secondary-grey font-bold text-lg"}>Test Suites</p>
                        <div className={"flex gap-1 items-center mr-5"}>
                            <PlusCircleIcon className={"w-6 h-6 text-pink-500"}/>
                            <span className="font-thin text-xs text-gray-600">Add New</span>
                        </div>
                    </div>
                    <div className={"bg-white p-4 rounded-md min-h-44 flex items-center"}>
                    </div>
                </div>
            )}
        </div>
    )
}

export default TestSuiteContentPage;