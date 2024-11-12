import React, {useEffect, useState} from 'react';
import FormInput from "../../FormInput.jsx";
import ProgressBar from "../../ProgressBar.jsx";
import useFetchTimeLogs from "../../../hooks/custom-hooks/task/useFetchTimeLogs.jsx";
import {getSpendTime} from "../../../utils/commonUtils.js";

const TimeTracking = ({estimation, taskId}) => {

    const {loading, data: timeLogs} = useFetchTimeLogs(taskId)
    const [spendTime, setSpendTime] = useState('');

    useEffect(() => {
        console.log(timeLogs)
        if (timeLogs && timeLogs.length) {
            setSpendTime(getSpendTime(timeLogs))
        } else {
            setSpendTime('')
        }
    }, [timeLogs]);

    return (
        <div className="w-full p-5 bg-white rounded-lg shadow-lg flex-col">
            <div className={"mb-6"}>
                <ProgressBar label="Time Tracking" progress={75}/>
            </div>
            <div className={"flex-col mb-6"}>
                <p className={"text-secondary-grey"}>Estimation</p>
                <FormInput
                    type="text"
                    name="estimation"
                    formValues={{estimation: estimation}}
                    // onChange={({target: {name, value}}) => handleFormChange(name, value, true)}
                    // formErrors={formErrors}
                    // showErrors={isValidationErrorsShown}
                />
            </div>
            <div className="flex w-full justify-between mb-5 gap-5">
                <div className={"flex-col w-full"}>
                    <p className={"text-secondary-grey"}>Spend Time</p>
                    <FormInput
                        type="text"
                        name="spendTime"
                        formValues={{spendTime: spendTime}}
                        // onChange={({target: {name, value}}) => handleFormChanges(name, value, true)}
                        // formErrors={formErrors}
                        // showErrors={isValidationErrorsShown}
                    />
                </div>
                <div className={"flex-col w-full"}>
                    <p className={"text-secondary-grey"}>Remaining Time</p>
                    <FormInput
                        type="text"
                        name="remainingTime"
                        formValues={{remainingTime: estimation}}
                        disabled={true}
                    />
                </div>
            </div>
            <p className={"text-text-color"}>Use the format: 2w 4d 6h 45m</p>
        </div>
    );
};

export default TimeTracking;
