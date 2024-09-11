import {useDispatch, useSelector} from "react-redux";
import React, {useEffect, useRef, useState} from "react";
import FormInput from "../../components/FormInput.jsx";
import FormSelect from "../../components/FormSelect.jsx";
import {selectProjectList, selectSelectedProject} from "../../state/slice/projectSlice.js";
import {PlusCircleIcon} from "@heroicons/react/24/outline/index.js";
import {doGetTestCaseFormData, selectTestCaseStatuses} from "../../state/slice/testCaseFormDataSlice.js";
import {selectSprintListForProject} from "../../state/slice/sprintSlice.js";
import {selectProjectUserList} from "../../state/slice/projectUsersSlice.js";
import {setSelectedTestPlan} from "../../state/slice/testPlansSlice.js";
import SkeletonLoader from "../../components/SkeletonLoader.jsx";
import ErrorAlert from "../../components/ErrorAlert.jsx";
import {
    doGetReleases,
    selectIsReleaseListForProjectError,
    selectIsReleaseListForProjectLoading,
    selectReleaseListForProject
} from "../../state/slice/releaseSlice.js";
import useFetchTestPlan from "../../hooks/custom-hooks/test-plan/useFetchTestPlan.jsx";
import TestSuiteEditComponent from "./TestSuiteEditComponent.jsx";
import TestSuiteCreateComponent from "./TestSuiteCreateComponent.jsx";

const TestPlanEditComponent = ({test_plan_id}) => {
    const dispatch = useDispatch();

    const selectedProject = useSelector(selectSelectedProject);
    const projects = useSelector(selectProjectList);
    const testCaseStatuses = useSelector(selectTestCaseStatuses);
    const sprintListForProject = useSelector(selectSprintListForProject);
    const projectUserList = useSelector(selectProjectUserList);
    const releases = useSelector(selectReleaseListForProject)
    const releaseLoading = useSelector(selectIsReleaseListForProjectLoading)
    const releaseError = useSelector(selectIsReleaseListForProjectError)

    const formRef = useRef(null);
    const [testPlanId, setTestPlanId] = useState(0);
    const [testSuiteId, setTestSuiteId] = useState(0);
    const [formValues, setFormValues] = useState({id: 0, name: '', sprint: 0, project: 0, release: 0});
    const [formErrors, setFormErrors] = useState({});
    const [isTestSuiteCreateOpen, setIsTestSuiteCreateOpen] = useState(false);
    const [isValidationErrorsShown, setIsValidationErrorsShown] = useState(false);

    const {loading, error, data: testPlan, refetch: reFetchTestPlan} = useFetchTestPlan(testPlanId)

    useEffect(() => {
        if (test_plan_id !== 0) {
            setTestPlanId(test_plan_id)
        }
    }, [test_plan_id]);

    useEffect(() => {
        if (selectedProject?.id) {
            dispatch(doGetReleases(selectedProject?.id));
            dispatch(doGetTestCaseFormData(selectedProject?.id))
        }
    }, [selectedProject]);

    useEffect(() => {
        if (testPlan?.id) {
            setFormValues({
                id: testPlan.id,
                name: testPlan.name,
                sprint: testPlan.sprintID,
                project: testPlan.projectID,
                release: testPlan.releaseID
            })
            dispatch(setSelectedTestPlan(testPlan))
        }
    }, [testPlan]);

    const getOptions = (options) => {
        return options.map(o => ({value: Number(o.id), label: o.name}));
    };

    const handleFormChange = (name, value) => {
        setFormValues({...formValues, [name]: value});
    };

    const onTestSuiteAddNew = () => {
        setIsTestSuiteCreateOpen(true)
    }

    const handleTestSuiteEditClose = (updated) => {
        setTestSuiteId(0)
        if (updated === true) {
            reFetchTestPlan()
        }
    };

    const handleTestSuiteCreateClose = (created) => {
        setIsTestSuiteCreateOpen(false);
        if (created === true) {
            reFetchTestPlan()
        }
    };

    if (loading || releaseLoading) {
        return <div className="m-10"><SkeletonLoader/></div>;
    }

    if (error || releaseError) {
        return <ErrorAlert message={error.message}/>;
    }

    return (
        <div className={"p-7 bg-dashboard-bgc h-content-screen overflow-y-auto"}>
            <p className={"text-secondary-grey font-bold text-2xl mb-4"}>Test Plan</p>
            {!testPlan?.id ? (
                <div className="p-8 text-center">No Details Available, Please Select a Test plan </div>
            ) : (
                <>
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
                            <div className={"flex gap-1 items-center mr-5 cursor-pointer"} onClick={onTestSuiteAddNew}>
                                <PlusCircleIcon className={"w-6 h-6 text-pink-500"}/>
                                <span className="font-thin text-xs text-gray-600">Add New</span>
                            </div>
                        </div>
                        <div className={"bg-white p-4 rounded-md min-h-44 flex items-center mb-10"}>
                            {testPlan?.testSuites && testPlan?.testSuites.length ? (
                                    <div className={"flex gap-4 w-full overflow-x-auto"}>
                                        {testPlan.testSuites.map(ts => (
                                            <div key={ts.id}
                                                 className={"flex flex-col gap-4 min-w-52 bg-dark-white border border-gray-200 rounded p-4 mb-4 cursor-pointer"}
                                                 onClick={() => setTestSuiteId(ts.id)}
                                            >
                                                <p className={"text-secondary-grey font-bold text-base"}>{ts?.summary}</p>
                                                {ts?.status && (
                                                    <p className={"text-secondary-grey text-xs bg-in-progress py-1 px-2 w-fit rounded"}>{testCaseStatuses.length ? testCaseStatuses.filter(tcs => tcs.id === ts?.status)[0]?.value : ''}</p>)}
                                                {ts?.assignee && (<div className={"flex gap-5"}>
                                                    <div
                                                        className="w-10 h-10 rounded-full bg-primary-pink flex items-center justify-center text-white text-lg font-semibold">
                                                        {projectUserList.length ? (() => {
                                                            const user = projectUserList.find(pul => pul.id === ts.assignee);
                                                            return `${user?.firstName?.[0] || 'N/'}${user?.lastName?.[0] || 'A'}`;
                                                        })() : "N/A"}
                                                    </div>
                                                    <p className={"text-secondary-grey text-xs mt-3"}>
                                                        {projectUserList.length ? (() => {
                                                            const user = projectUserList.find(pul => pul.id === ts.assignee);
                                                            return user?.firstName || "N/A";
                                                        })() : "N/A"}
                                                    </p>
                                                </div>)}
                                            </div>))}
                                    </div>) :
                                (<p className={"text-secondary-grey text-xs text-center w-full"}>No test suites</p>)}
                        </div>
                        <TestSuiteEditComponent testSuiteId={testSuiteId} onClose={handleTestSuiteEditClose}/>
                    </div>
                    <TestSuiteCreateComponent isOpen={isTestSuiteCreateOpen} onClose={handleTestSuiteCreateClose}/>
                </>
            )}
        </div>
    )
}

export default TestPlanEditComponent;