import {useSelector} from "react-redux";
import {
    selectIsTestPlanDetailsError,
    selectIsTestPlanDetailsLoading,
    selectSelectedTestPlan
} from "../../state/slice/testPlanSlice.js";
import React, {useEffect, useRef, useState} from "react";
import SkeletonLoader from "../../components/SkeletonLoader.jsx";
import ErrorAlert from "../../components/ErrorAlert.jsx";
import FormInput from "../../components/FormInput.jsx";
import FormSelect from "../../components/FormSelect.jsx";
import {selectProjectList, selectSelectedProject} from "../../state/slice/projectSlice.js";
import {useFetchProjectSprints} from "../../hooks/SprintHooks/useFetchProjectSprints.jsx";
import {useFetchReleases} from "../../hooks/releaseHooks/useFetchReleases.jsx";
import {PlusCircleIcon} from "@heroicons/react/24/outline/index.js";

const TestPlanContentPage = () => {
    const isTestPlanDetailsLoading = useSelector(selectIsTestPlanDetailsLoading);
    const isTestPlanDetailsError = useSelector(selectIsTestPlanDetailsError);
    const selectedTestPlan = useSelector(selectSelectedTestPlan);
    const selectedProject = useSelector(selectSelectedProject);
    const projects = useSelector(selectProjectList);

    const {sprints, loading: sprintLoading, error: sprintError} = useFetchProjectSprints(selectedProject?.id)
    const {releases, loading: releaseLoading, error: releaseError} = useFetchReleases(selectedProject?.id)

    const formRef = useRef(null);
    const [formValues, setFormValues] = useState({id: 0, name: '', sprint: 0, project: 0, release: 0});
    const [formErrors, setFormErrors] = useState({});
    const [isValidationErrorsShown, setIsValidationErrorsShown] = useState(false);

    useEffect(() => {
        if (selectedTestPlan?.id) {
            console.log(selectedTestPlan.testSuites)
            setFormValues({
                id: selectedTestPlan.id,
                name: selectedTestPlan.name,
                sprint: selectedTestPlan.sprintID,
                project: selectedTestPlan.projectID,
                release: selectedTestPlan.releaseID
            })
        }
    }, [selectedTestPlan]);

    const getOptions = (options) => {
        return options.map(o => ({value: Number(o.id), label: o.name}));
    };

    const handleFormChange = (name, value) => {
        setFormValues({...formValues, [name]: value});
    };

    if (isTestPlanDetailsLoading || sprintLoading || releaseLoading) {
        return <div className="m-10"><SkeletonLoader/></div>;
    }

    if (isTestPlanDetailsError || sprintError || releaseError) {
        return <ErrorAlert message={error.message}/>;
    }

    return (
        <div className={"p-7 bg-dashboard-bgc h-full"}>
            <p className={"text-secondary-grey font-bold text-2xl mb-4"}>Test Plan</p>
            {!selectedTestPlan ? (
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
                                    options={sprints.length ? getOptions(sprints) : []}
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
                        {selectedTestPlan?.testSuites.length ? (
                            <div className={"flex gap-2 w-full overflow-x-auto"}>
                                {selectedTestPlan?.testSuites.map(ts => (
                                    <div className={"flex-col"}>
                                        <div><p>{ts?.summary}</p></div>
                                        <p>{ts?.status}</p>
                                        <div
                                            className="w-8 h-8 rounded-full bg-primary-pink flex items-center justify-center text-white text-lg font-semibold">
                                            {ts?.assignee}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className={"text-secondary-grey text-xs text-center w-full"}>No test suites</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}

export default TestPlanContentPage;