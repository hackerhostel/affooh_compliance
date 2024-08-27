import {useSelector} from "react-redux";
import React, {useEffect, useState} from "react";
import {selectSelectedTestPlan} from "../../state/slice/testPlansSlice.js";
import {useParams} from "react-router-dom";
import useFetchTestExecution from "../../hooks/custom-hooks/test-plan/useFetchTestExecution.jsx";
import SkeletonLoader from "../../components/SkeletonLoader.jsx";
import ErrorAlert from "../../components/ErrorAlert.jsx";
import {ChevronDownIcon, ChevronRightIcon} from "@heroicons/react/24/outline/index.js";
import {doGetTestCaseFormData, selectTestCaseStatuses} from "../../state/slice/testCaseFormDataSlice.js";
import {selectSelectedProject} from "../../state/slice/projectSlice.js";
import FormSelect from "../../components/FormSelect.jsx";
import {getInitials} from "../../utils/commonUtils.js";

const TestSuiteContentPage = () => {
    const {test_suite_id} = useParams();

    const selectedProject = useSelector(selectSelectedProject);
    const selectedTestPlan = useSelector(selectSelectedTestPlan);
    const testCaseStatuses = useSelector(selectTestCaseStatuses);

    const [testCycleId, setTestCycleId] = useState(0)
    const [testExecutionCycles, setTestExecutionCycles] = useState([]);
    const [testExecutions, setTestExecutions] = useState([]);

    const {loading, error, data: testExecutionResponse} = useFetchTestExecution(Number(test_suite_id), testCycleId)

    useEffect(() => {
        if (testExecutionResponse.length) {
            setTestExecutions(testExecutionResponse)
        }
    }, [testExecutionResponse]);

    useEffect(() => {
        if (selectedTestPlan?.id) {
            const filteredTestExecutionCycles = selectedTestPlan?.testExecutionOptions.filter(to => to.id === Number(test_suite_id))[0].cycles
            setTestExecutionCycles(filteredTestExecutionCycles)
            setTestCycleId(filteredTestExecutionCycles[0].id)
        }
        if (!testCaseStatuses.length) {
            dispatch(doGetTestCaseFormData(selectedProject?.id))
        }
    }, [selectedTestPlan, test_suite_id]);

    const getOptions = (options) => {
        return options.map(o => ({value: Number(o.id), label: o.name}));
    };

    const handleCycleChange = (value) => {
        if (value) {
            setTestCycleId(value)
        }
    };

    if (loading) {
        return <div className="m-10"><SkeletonLoader/></div>;
    }

    if (error) {
        return <ErrorAlert message={error.message}/>;
    }

    const GenerateRow = (props) => {
        const {row} = props
        const [open, setOpen] = React.useState(false);
        const [status, setStatus] = React.useState(row?.status || 0);
        const [note, setNote] = React.useState(row?.notes || '');
        const [statusChanged, setStatusChanged] = React.useState(false);
        const [noteChanged, setNoteChanged] = React.useState(false);

        const handleChanges = () => {
            console.log("changes")
        }

        return (
            <>
                <tr className="border-b">
                    <td className="px-4 py-2">
                        <div
                            className="text-gray-600 hover:text-gray-900 focus:outline-none"
                            onClick={() => setOpen(!open)}
                        >
                            {open ? <ChevronDownIcon className={"w-4 h-4 text-black cursor-pointer"}/> :
                                <ChevronRightIcon className={"w-4 h-4 text-black cursor-pointer"}/>}
                        </div>
                    </td>
                    <td className="px-4 py-2">{row?.summary}</td>
                    <td className="px-4 py-2">{row?.platform}</td>
                    <td className="px-4 py-2">{row?.priority}</td>
                    <td className="px-4 py-2">{row?.category}</td>
                    <td className="px-4 py-2">
                        <div
                            className="w-10 h-10 rounded-full bg-primary-pink flex items-center justify-center text-white text-lg font-semibold">
                            {row?.assignee ? (getInitials(row?.assignee)) : "N/A"}
                        </div>
                    </td>
                    <td className="px-4 py-2">
                        <div>
                            <select
                                onChange={handleChanges}
                                value={status}
                                className="w-full p-2 border border-gray-300 rounded"
                            >
                                {testCaseStatuses.map((option) => (
                                    <option key={option?.id} value={option?.id}>
                                        {option?.value}
                                    </option>
                                ))}
                            </select>
                            {/*{statusChanged && (*/}
                            {/*    <div className="flex justify-center mt-2">*/}
                            {/*        <button className="p-1 text-green-600" onClick={() => handleStatusActions(true)}>*/}
                            {/*            <CheckIcon/>*/}
                            {/*        </button>*/}
                            {/*        <button className="p-1 text-red-600" onClick={() => handleStatusActions(false)}>*/}
                            {/*            <ClearIcon/>*/}
                            {/*        </button>*/}
                            {/*    </div>*/}
                            {/*)}*/}
                        </div>
                    </td>
                    <td className="px-4 py-2">
                        <div>
                            <input
                                type="text"
                                onChange={handleChanges}
                                value={note}
                                className="w-full p-2 border border-gray-300 rounded"
                            />
                            {/*{noteChanged && (*/}
                            {/*    <div className="flex justify-center mt-2">*/}
                            {/*        <button className="p-1 text-green-600"*/}
                            {/*            // onClick={() => handleNoteActions(true)}*/}
                            {/*        >*/}
                            {/*            <CheckIcon/>*/}
                            {/*        </button>*/}
                            {/*        <button className="p-1 text-red-600"*/}
                            {/*            // onClick={() => handleNoteActions(false)}*/}
                            {/*        >*/}
                            {/*            <ClearIcon/>*/}
                            {/*        </button>*/}
                            {/*    </div>*/}
                            {/*)}*/}
                        </div>
                    </td>
                </tr>
                {row?.steps && row.steps.length > 0 && (
                    <tr>
                        <td className="p-0" colSpan={8}>
                            <div
                                className={`overflow-hidden transition-[max-height] duration-300 ${open ? 'max-h-[1000px]' : 'max-h-0'} mb-4`}>
                                <table className="min-w-full border-collapse mt-2 rounded-2xl p-20">
                                    <thead>
                                    <tr>
                                        <th className="px-4 py-2"></th>
                                        <th className="px-4 py-2 text-left bg-secondary-bgc rounded-tl-lg"></th>
                                        <th className="px-4 py-2 text-left bg-secondary-bgc"></th>
                                        <th className="px-4 py-2 text-left bg-secondary-bgc rounded-tr-lg"></th>
                                    </tr>
                                    <tr>
                                        <th className="px-4 py-2"></th>
                                        <th className="px-4 py-2 text-left bg-secondary-bgc">Steps</th>
                                        <th className="px-4 py-2 text-left bg-secondary-bgc">Input Data</th>
                                        <th className="px-4 py-2 text-left bg-secondary-bgc">Expected
                                            Outcome
                                        </th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {row.steps.map((step) => (
                                        <tr key={step.id}>
                                            <td className="px-4 py-2"></td>
                                            <td className="px-4 py-2 bg-secondary-bgc">{step?.description}</td>
                                            <td className="px-4 py-2 bg-secondary-bgc">{step?.inputData}</td>
                                            <td className="px-4 py-2 bg-secondary-bgc">{step?.expectedOutcome}</td>
                                        </tr>
                                    ))}
                                    <tr key={0}>
                                        <td className="px-4 py-2"></td>
                                        <td className="px-4 py-2 bg-secondary-bgc rounded-bl-lg"></td>
                                        <td className="px-4 py-2 bg-secondary-bgc"></td>
                                        <td className="px-4 py-2 bg-secondary-bgc rounded-br-lg"></td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>
                        </td>
                    </tr>
                )}
            </>
        );
    };

    return (
        <div className={"p-7 bg-dashboard-bgc h-full"}>
            <div className={"flex w-full justify-between items-center mb-10"}>
                <p className={"text-secondary-grey font-bold text-2xl text-center align-middle"}>Test Execution List</p>
                {testCycleId !== 0 && (
                    <div className={"flex gap-8  justify-end w-1/2"}>
                        <div className={"w-1/3"}>
                            <FormSelect
                                name="cycle"
                                formValues={{cycle: testCycleId}}
                                options={testExecutionCycles.length ? getOptions(testExecutionCycles) : []}
                                onChange={({target: {value}}) => handleCycleChange(value)}
                            />
                        </div>
                        <button className="bg-primary-pink text-white px-14 rounded-lg">
                            Edit
                        </button>
                    </div>
                )}
            </div>
            {testCycleId === 0 ? (
                <div className="p-8 text-center">No Details Available, Please Select a Test Cycle </div>
            ) : (
                <div className={"flex-col"}>
                    <div className={"bg-white p-4 rounded-md"}>
                        <table className="min-w-full border-collapse">
                            <thead>
                            <tr>
                                <th className="px-4 py-2"></th>
                                <th className="px-4 py-2 text-left">Summary</th>
                                <th className="px-4 py-2 text-left">Platform</th>
                                <th className="px-4 py-2 text-left">Priority</th>
                                <th className="px-4 py-2 text-left">Category</th>
                                <th className="px-4 py-2 text-left">Assignee</th>
                                <th className="px-4 py-2 text-left">Status</th>
                                <th className="px-4 py-2 text-left">Notes</th>
                            </tr>
                            </thead>
                            <tbody>
                            {testExecutions.map((row) => (
                                <GenerateRow row={row} key={row.testCycleExecutionID}/>
                            ))}
                            </tbody>
                        </table>

                    </div>
                </div>
            )}
        </div>
    )
}

export default TestSuiteContentPage;