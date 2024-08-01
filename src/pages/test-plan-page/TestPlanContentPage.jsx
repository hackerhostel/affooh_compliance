import {useSelector} from "react-redux";
import {
    selectIsTestPlanDetailsError,
    selectIsTestPlanDetailsLoading,
    selectSelectedTestPlan
} from "../../state/slice/testPlanSlice.js";
import React from "react";
import SkeletonLoader from "../../components/SkeletonLoader.jsx";
import ErrorAlert from "../../components/ErrorAlert.jsx";

const TestPlanContentPage = () => {
    const isTestPlanDetailsLoading = useSelector(selectIsTestPlanDetailsLoading);
    const isTestPlanDetailsError = useSelector(selectIsTestPlanDetailsError);
    const selectedTestPlan = useSelector(selectSelectedTestPlan);

    if (isTestPlanDetailsLoading) {
        return <div className="m-10"><SkeletonLoader/></div>;
    }

    if (isTestPlanDetailsError) {
        return <ErrorAlert message={error.message}/>;
    }

    return (
        <div className={"p-4"}>
            {!selectedTestPlan ? (
                <div className="p-8 text-center">No Details</div>
            ) : (
                <div className="p-4 text-center">selected id: {selectedTestPlan?.id}</div>
            )}
        </div>
  )
}

export default TestPlanContentPage;