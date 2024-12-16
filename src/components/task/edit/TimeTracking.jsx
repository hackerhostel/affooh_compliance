import React, {useEffect, useState} from 'react';
import FormInput from "../../FormInput.jsx";
import ProgressBar from "../../ProgressBar.jsx";
import {getSpendTime} from "../../../utils/commonUtils.js";
import FormInputWrapper from "./FormEditInputWrapper.jsx";

const TimeTracking = ({
                          initialEstimationAttribute = {},
                          timeLogs,
                          isEditing,
                          updateTaskAttribute,
                          taskFieldID,
                      }) => {
    const [spendTime, setSpendTime] = useState('');
    const [estimation, setEstimation] = useState('');
    const [initialEstimation, setInitialEstimation] = useState('');

    useEffect(() => {
        if (timeLogs && timeLogs.length) {
            setSpendTime(getSpendTime(timeLogs))
        } else {
            setSpendTime('')
        }
    }, [timeLogs]);

    useEffect(() => {
        if (initialEstimationAttribute.taskFieldID) {
            setInitialEstimation(initialEstimationAttribute?.values ? initialEstimationAttribute?.values[0] : '')
            setEstimation(initialEstimationAttribute?.values ? initialEstimationAttribute?.values[0] : '')
        } else {
            setInitialEstimation('')
            setEstimation('')
        }
    }, [initialEstimationAttribute]);

    return (
        <div className="w-full p-5 bg-white rounded-lg shadow-lg flex-col">
            <div className={"mb-6"}>
                <ProgressBar label="Time Tracking" progress={75}/>
            </div>
            <div className={"flex-col mb-6"}>
                <p className={"text-secondary-grey"}>Estimation</p>
                <FormInputWrapper
                    isEditing={isEditing}
                    initialData={{estimation: initialEstimation}}
                    currentData={{estimation: estimation}}
                    onAccept={() => updateTaskAttribute(taskFieldID, estimation)}
                    onReject={() => setEstimation(initialEstimation)}
                    actionButtonPlacement={"bottom"}
                >
                    <FormInput
                        type="text"
                        name="estimation"
                        formValues={{estimation: estimation}}
                        onChange={({target: {value}}) => setEstimation(value)}
                    />
                </FormInputWrapper>
            </div>
            <div className="flex w-full justify-between mb-5 gap-5">
                <div className={"flex-col w-full"}>
                    <p className={"text-secondary-grey"}>Spend Time</p>
                    <FormInput
                        type="text"
                        name="spendTime"
                        formValues={{spendTime: spendTime}}
                        disabled={true}
                    />
                </div>
                <div className={"flex-col w-full"}>
                    <p className={"text-secondary-grey"}>Remaining Time</p>
                    <FormInput
                        type="text"
                        name="remainingTime"
                        formValues={{remainingTime: ''}}
                        disabled={true}
                    />
                </div>
            </div>
            <p className={"text-text-color"}>Use the format: 2w 4d 6h 45m</p>
        </div>
    );
};

export default TimeTracking;
