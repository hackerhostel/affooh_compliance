import {useDispatch, useSelector} from "react-redux";
import React, {useEffect, useState} from "react";
import {selectSelectedTestPlanId} from "../../state/slice/testPlansSlice.js";
import SkeletonLoader from "../../components/SkeletonLoader.jsx";
import ErrorAlert from "../../components/ErrorAlert.jsx";
import {ChevronDownIcon, ChevronRightIcon} from "@heroicons/react/24/outline/index.js";
import {doGetTestCaseFormData, selectTestCaseStatuses} from "../../state/slice/testCaseFormDataSlice.js";
import {selectSelectedProject} from "../../state/slice/projectSlice.js";
import FormSelect from "../../components/FormSelect.jsx";
import {getInitials, getSelectOptions} from "../../utils/commonUtils.js";
import useFetchTestPlan from "../../hooks/custom-hooks/test-plan/useFetchTestPlan.jsx";
import useFetchTestExecution from "../../hooks/custom-hooks/test-plan/useFetchTestExecution.jsx";
import {XMarkIcon, CheckIcon} from "@heroicons/react/24/outline";
import axios from "axios";
import {useToasts} from "react-toast-notifications";
import {useHistory} from "react-router-dom";

const TestSuiteContentPage = () => {
    const dispatch = useDispatch();
    const {addToast} = useToasts();
    const history = useHistory();

    const selectedProject = useSelector(selectSelectedProject);
    const selectedTestPlanId = useSelector(selectSelectedTestPlanId);
    const testCaseStatuses = useSelector(selectTestCaseStatuses);

    const [testExecutionCycles, setTestExecutionCycles] = useState([]);
    const [testExecutionOptions, setTestExecutionOptions] = useState([]);
    const [testExecutions, setTestExecutions] = useState([]);
    const [testPlan, setTestPlan] = useState({});
    const [testPlanId, setTestPlanId] = useState(0);
    const [testSuiteId, setTestSuiteId] = useState(0);
    const [testCycleId, setTestCycleId] = useState(0);
    const [isUpdating, setIsUpdating] = useState(false);

    const {loading: testPlanLoading, error: testPlanError, data: testPlanResponse} = useFetchTestPlan(testPlanId)
    const {
        loading: testExecutionLoading,
        error: testExecutionError,
        data: testExecutionResponse
    } = useFetchTestExecution(testSuiteId, testCycleId)

    useEffect(() => {
        if (testPlanResponse?.id) {
            setTestPlan(testPlanResponse)
            setTestExecutionCycles([])
            setTestExecutionOptions([])
            let testEOP = testPlanResponse?.testExecutionOptions || []
            if (testEOP.length) {
                setTestExecutionOptions(testEOP)
                setTestSuiteId(testEOP[0].id)
            }
        }
        if (!testCaseStatuses.length) {
            dispatch(doGetTestCaseFormData(selectedProject?.id))
        }
    }, [testPlanResponse]);

    useEffect(() => {
        if (selectedTestPlanId !== 0 && testPlan?.id !== selectedTestPlanId) {
            setTestPlanId(selectedTestPlanId)
        }
        if (selectedTestPlanId === 0) {
            setTestPlan({})
        }
    }, [selectedTestPlanId]);

    useEffect(() => {
        if (testExecutionResponse.length) {
            setTestExecutions(testExecutionResponse)
        }
    }, [testExecutionResponse]);

    useEffect(() => {
        if (testSuiteId !== 0) {
            const filteredTestExecutionCycles = testExecutionOptions.filter(to => to.id === Number(testSuiteId))[0]?.cycles
            if (filteredTestExecutionCycles && filteredTestExecutionCycles.length) {
                setTestExecutionCycles(filteredTestExecutionCycles)
                setTestCycleId(filteredTestExecutionCycles[0].id)
            }
        }
    }, [testSuiteId]);

    const handleSuiteChange = (value) => {
        if (value) {
            setTestSuiteId(Number(value))
        }
    };

    const handleCycleChange = (value) => {
        if (value) {
            setTestCycleId(Number(value))
        }
    };

    const openTestSuiteEdit = () => {
        history.push(`/test-plans/${testPlanId}`);
    }

    const updateRow = async (rowID, updatedData) => {
        setIsUpdating(true)

        try {
            const response = await axios.put('/test-case/update', {testExecData: updatedData});

            if (response) {
                setIsUpdating(false);
                setTestExecutions((prevRows) =>
                    prevRows.map((row) =>
                        row.testCycleExecutionID === rowID
                            ? {...row, ...updatedData}
                            : row
                    )
                );
                addToast('Successfully Update Test Execution Item', {appearance: 'success'});
            }
        } catch (e) {
            setIsUpdating(false)
            addToast('Failed To Update Test Execution Item', {appearance: 'error'});
        }
    }

    if (testPlanLoading) {
        return <div className="m-10"><SkeletonLoader/></div>;
    }

    if (testPlanError || testExecutionError) {
        return <ErrorAlert message={error.message}/>;
    }

    const GenerateRow = (props) => {
        const {row} = props
        const [open, setOpen] = React.useState(false);
        const [status, setStatus] = React.useState(row?.status || 8);
        const [note, setNote] = React.useState(row?.notes || '');
        const [noteChanged, setNoteChanged] = React.useState(false);

        const handleStatusUpdate = (name, value) => {
            setStatus(value);
            props.onUpdate(row.testCycleExecutionID, {...row, status: value});
        };

        const onNoteChange = (value) => {
            if (value || value === '') {
                setNoteChanged(true);
                setNote(value);
            } else {
                setNoteChanged(false)
                setNote(row.notes)
            }
        }

        const onSaveNote = async () => {
            setNoteChanged(false);

            props.onUpdate(row.testCycleExecutionID, {...row, notes: note});
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
                                disabled={isUpdating}
                                onChange={({target: {name, value}}) => handleStatusUpdate(name, value)}
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
                        <div className="relative">
                            <input
                                disabled={isUpdating}
                                type="text"
                                value={note}
                                onChange={(e) => onNoteChange(e.target.value)}
                                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-20"
                            />

                            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1">
                                {noteChanged && (
                                    <div>
                                        <button
                                            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                                            aria-label="Clear input"
                                        >
                                            <XMarkIcon onClick={() => onNoteChange(false)}
                                                       className="w-5 h-5 text-gray-500"/>
                                        </button>

                                        <button
                                            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                                            aria-label="Save input"
                                        >
                                            <CheckIcon onClick={() => onSaveNote()}
                                                       className="w-5 h-5 text-green-500"/>
                                        </button>
                                    </div>
                                )}
                            </div>
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
                <div>
                    {testPlan?.id && (
                        <p className={"text-secondary-grey font-bold text-md align-left"}>{testPlan.name}</p>
                    )}
                    <p className={"text-secondary-grey font-bold text-xl align-middle"}>Test Execution List</p>
                </div>
                <div className={"flex gap-5  justify-end w-1/2"}>
                    {testPlanId !== 0 && testExecutionOptions.length > 0 && (
                        <div className={"w-3/5"}>
                            <FormSelect
                                name="suite"
                                formValues={{suite: testSuiteId}}
                                options={testExecutionOptions.length ? getSelectOptions(testExecutionOptions) : []}
                                onChange={({target: {value}}) => handleSuiteChange(value)}
                            />
                        </div>
                    )}
                    {testCycleId !== 0 && testExecutionCycles.length > 0 && (
                        <div className={"w-2/5"}>
                            <FormSelect
                                name="cycle"
                                formValues={{cycle: testCycleId}}
                                options={testExecutionCycles.length ? getSelectOptions(testExecutionCycles) : []}
                                onChange={({target: {value}}) => handleCycleChange(value)}
                            />
                        </div>
                    )}
                    {testExecutionOptions.length > 0 && testExecutionCycles.length > 0 && (
                        <button onClick={openTestSuiteEdit} className="bg-primary-pink text-white px-14 rounded-lg">
                            Edit
                        </button>
                    )}
                </div>
            </div>
            {testPlanId === 0 ? (
                <div className="p-8 text-center">No Details Available, Please Select a Test Plan </div>
            ) : testExecutionOptions?.length === 0 ? (
                <div className="p-8 text-center">No Test Suites Available, Please Create a Test Suite </div>
            ) : testCycleId === 0 ? (
                <div className="p-8 text-center">No Details Available, Please Select a Test Cycle </div>
            ) : (
                <div className={"flex-col"}>
                    <div className={"bg-white p-4 rounded-md"}>
                        {testExecutionLoading ? (
                            <div className="m-10"><SkeletonLoader/></div>
                        ) : (
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
                                    <GenerateRow row={row} key={row.testCycleExecutionID} onUpdate={updateRow}/>
                                ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}

export default TestSuiteContentPage;