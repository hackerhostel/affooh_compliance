import {useSelector} from "react-redux";
import {
    selectIsTestPlanDetailsError,
    selectIsTestPlanDetailsLoading,
    selectSelectedTestPlan
} from "../../state/slice/testPlanSlice.js";
import React, {useRef, useState} from "react";
import SkeletonLoader from "../../components/SkeletonLoader.jsx";
import ErrorAlert from "../../components/ErrorAlert.jsx";
import FormInput from "../../components/FormInput.jsx";
import FormSelect from "../../components/FormSelect.jsx";

const TestPlanContentPage = () => {
    const isTestPlanDetailsLoading = useSelector(selectIsTestPlanDetailsLoading);
    const isTestPlanDetailsError = useSelector(selectIsTestPlanDetailsError);
    const selectedTestPlan = useSelector(selectSelectedTestPlan);

    const formRef = useRef(null);
    const [formValues, setFormValues] = useState({name: '', sprint: 0, project: 0, release: 0});
    const [formErrors, setFormErrors] = useState({});
    const [isValidationErrorsShown, setIsValidationErrorsShown] = useState(false);

    const handleFormChange = (name, value) => {
        setFormValues({...formValues, [name]: value});
    };
    console.log(selectedTestPlan)

    if (isTestPlanDetailsLoading) {
        return <div className="m-10"><SkeletonLoader/></div>;
    }

    if (isTestPlanDetailsError) {
        return <ErrorAlert message={error.message}/>;
    }

    const getSprintOptions = () => {
        return [
            {value: '1', label: 'Sprint 1'},
            {value: '2', label: 'Sprint 2'},
        ];
    };

    const getProjectOptions = () => {
        return [
            {value: '1', label: 'Project 1'},
            {value: '2', label: 'Project 2'},
        ];
    };

    const getReleaseOptions = () => {
        return [
            {value: '1', label: 'Release 1'},
            {value: '2', label: 'Release 2'},
        ];
    };

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
                                    options={getSprintOptions()}
                                    onChange={({target: {name, value}}) => handleFormChange(name, value)}
                                />
                            </div>
                            <div className={"flex-col w-1/4"}>
                                <p className={"text-secondary-grey"}>Project</p>
                                <FormSelect
                                    name="project"
                                    formValues={formValues}
                                    options={getProjectOptions()}
                                    onChange={({target: {name, value}}) => handleFormChange(name, value)}
                                />
                            </div>
                            <div className={"flex-col w-1/5"}>
                                <p className={"text-secondary-grey"}>Project</p>
                                <FormSelect
                                    name="release"
                                    formValues={formValues}
                                    options={getReleaseOptions()}
                                    onChange={({target: {name, value}}) => handleFormChange(name, value)}
                                />
                            </div>
                        </form>
                    </div>
                    <div className="p-4 text-center">selected id: {selectedTestPlan?.id}</div>
                </div>
            )}
        </div>
    )
}

export default TestPlanContentPage;