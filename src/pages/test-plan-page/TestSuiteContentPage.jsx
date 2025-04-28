import { useDispatch, useSelector } from "react-redux";
import React, { useEffect, useState } from "react";
import { selectSelectedTestPlanId } from "../../state/slice/testPlansSlice.js";
import SkeletonLoader from "../../components/SkeletonLoader.jsx";
import ErrorAlert from "../../components/ErrorAlert.jsx";
import {
  ChevronDownIcon,
  ChevronRightIcon,
  PlusCircleIcon,
} from "@heroicons/react/24/outline/index.js";
import {
  doGetTestCaseFormData,
  selectTestCaseStatuses,
} from "../../state/slice/testCaseFormDataSlice.js";
import { selectSelectedProject } from "../../state/slice/projectSlice.js";
import FormSelect from "../../components/FormSelect.jsx";
import { getInitials, getSelectOptions } from "../../utils/commonUtils.js";
import useFetchTestPlan from "../../hooks/custom-hooks/test-plan/useFetchTestPlan.jsx";
import useFetchTestExecution from "../../hooks/custom-hooks/test-plan/useFetchTestExecution.jsx";
import { CheckIcon, XMarkIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import { useToasts } from "react-toast-notifications";
import { useHistory } from "react-router-dom";
import FormTextArea from "../../components/FormTextArea.jsx";
import AddIssue from "./AddIssue.jsx";
import IssueListPopup from "./IssueListPopup.jsx";
import useFetchTestSuite from "../../hooks/custom-hooks/test-plan/useFetchTestSuite.jsx";
import useFetchIssue from "../../hooks/custom-hooks/test-plan/useFetchIssue.jsx";
import { doGetIssueCount } from "../../state/slice/testIssueSlice.js";

const TestSuiteContentPage = () => {
  const dispatch = useDispatch();
  const { addToast } = useToasts();
  const history = useHistory();

  const selectedProject = useSelector(selectSelectedProject);
  const selectedTestPlanId = useSelector(selectSelectedTestPlanId);
  const testCaseStatuses = useSelector(selectTestCaseStatuses);

  const [testExecutionCycles, setTestExecutionCycles] = useState([]);
  const [testExecutionOptions, setTestExecutionOptions] = useState([]);
  const [testExecutions, setTestExecutions] = useState([]);
  const [testPlan, setTestPlan] = useState({});
  const [testPlanId, setTestPlanId] = useState(0);
  const [testSuiteID, setTestSuiteId] = useState(0);
  const [testCycleId, setTestCycleId] = useState(0);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isOpenAddIssue, setIsOpenAddIssue] = useState(false);
  const [isOpenIssueList, setIsIssueList] = useState(false);
  const [selectedTestCaseId, setSelectedTestCaseId] = useState(null);
  const [selectedPlatform, setSelectedPlatform] = useState(null);
  const [statusCounts, setStatusCounts] = useState({
    all: 0,
    pass: 0,
    fail: 0,
    pending: 0,
  });

  const { fetchTestSuite } = useFetchTestSuite(testSuiteID);
  const {
    data: issues,
    error: issueError,
    loading: issueLoading,
    refetch: fetchIssue,
  } = useFetchIssue(testSuiteID);

  useEffect(() => {
    if (!testCaseStatuses.length) {
      dispatch(doGetTestCaseFormData(selectedProject?.id));
    }
  }, [dispatch, selectedProject, testCaseStatuses]);

  const {
    loading: testPlanLoading,
    error: testPlanError,
    data: testPlanResponse,
  } = useFetchTestPlan(testPlanId);
  const {
    loading: testExecutionLoading,
    error: testExecutionError,
    data: testExecutionResponse,
    refetch: refetchTextExecution,
  } = useFetchTestExecution(testSuiteID, testCycleId);

  useEffect(() => {
    if (testPlanResponse?.id) {
      setTestPlan(testPlanResponse);
      setTestExecutionCycles([]);
      setTestExecutionOptions([]);
      let testEOP = testPlanResponse?.testExecutionOptions || [];
      if (testEOP.length) {
        setTestExecutionOptions(testEOP);
        setTestSuiteId(testEOP[0].id);
      }
    }
  }, [testPlanResponse]);

  useEffect(() => {
    if (selectedTestPlanId !== 0 && testPlan?.id !== selectedTestPlanId) {
      setTestPlanId(selectedTestPlanId);
    }
    if (selectedTestPlanId === 0) {
      setTestPlan({});
    }
  }, [selectedTestPlanId]);

  useEffect(() => {
    if (testExecutionResponse.length) {
      setTestExecutions(testExecutionResponse);
    }
  }, [testExecutionResponse]);

  useEffect(() => {
    setStatusCounts({
      ...statusCounts,
      all: testExecutions?.length,
      pass: testExecutions?.filter((item) => item.status === 20).length,
      fail: testExecutions?.filter((item) => item.status === 21).length,
      pending: testExecutions?.filter((item) => item.status === 13).length,
    });
  }, [testExecutions]);

  useEffect(() => {
    if (testSuiteID !== 0) {
      const filteredTestExecutionCycles = testExecutionOptions.filter(
        (to) => to.id === Number(testSuiteID)
      )[0]?.cycles;
      if (filteredTestExecutionCycles && filteredTestExecutionCycles.length) {
        setTestExecutionCycles(filteredTestExecutionCycles);
        setTestCycleId(filteredTestExecutionCycles[0].id);
      }
    }
  }, [testSuiteID]);

  useEffect(() => {
    if (testSuiteID) {
      fetchTestSuite();
      fetchIssue();
    }
  }, [testSuiteID, fetchTestSuite, fetchIssue]);

  const handleAddIssue = (testCaseID, platform) => {
    setSelectedTestCaseId(testCaseID);
    setSelectedPlatform(platform);
    setIsOpenAddIssue(true);
  };

  const handleIssueList = (testCaseID, platform) => {
    setSelectedTestCaseId(testCaseID);
    setSelectedPlatform(platform);
    setIsIssueList(true);
  };

  const handleSuiteChange = (value) => {
    if (value) {
      setTestSuiteId(Number(value));
    }
  };

  const handleCycleChange = (value) => {
    if (value) {
      setTestCycleId(Number(value));
    }
  };

  const openTestSuiteEdit = () => {
    history.push(`/test-plans/${testPlanId}`);
  };

  const updateRow = async (rowID, updatedData) => {
    setIsUpdating(true);
    try {
      const response = await axios.put("/test-case/update", {
        testExecData: updatedData,
      });
      if (response) {
        setIsUpdating(false);
        addToast("Successfully Updated Test Execution Item", {
          appearance: "success",
        });
        refetchTextExecution(true);
      }
    } catch (e) {
      setIsUpdating(false);
      addToast("Failed To Update Test Execution Item", { appearance: "error" });
    }
  };

  const handleAddIssueClose = async (issueAdded) => {
    setIsOpenAddIssue(false);
    if (issueAdded) {
      await fetchTestSuite();
      await fetchIssue();
      refetchTextExecution(true);
      setTestSuiteId((prev) => prev);
    }
    setSelectedTestCaseId(null);
    setSelectedPlatform(null);
  };

  if (testPlanLoading) {
    return (
      <div className="m-10">
        <SkeletonLoader />
      </div>
    );
  }

  if (testPlanError || testExecutionError) {
    return (
      <ErrorAlert
        message={testPlanError?.message || testExecutionError?.message}
      />
    );
  }

  const StatusCount = ({ count, label, variant = "default" }) => {
    const variants = {
      default: "border-gray-300 text-gray-600",
      success: "border-green-500 text-green-600",
      danger: "border-red-500 text-red-600",
      warning: "border-yellow-500 text-yellow-600",
    };

    return (
      <div
        className={`border rounded-full px-3 py-1 text-sm ${variants[variant]}`}
      >
        {count} {label}
      </div>
    );
  };

  const TestExecutionRow = ({ testExecution, onUpdate }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [updatedExecution, setUpdatedExecution] = useState({
      ...testExecution,
    });
    const [issueCount, setIssueCount] = useState(0);

    useEffect(() => {
      if (testSuiteID && testExecution.testCaseId) {
        dispatch(
          doGetIssueCount({
            testSuiteID,
            testCaseID: testExecution.testCaseId,
          })
        ).then((response) => {
          if (response.payload) {
            setIssueCount(response.payload.count || 0);
          }
        });
      }
    }, [testSuiteID, testExecution.testCaseId, dispatch]);

    const handleInputChange = (field, value) => {
      setUpdatedExecution((prev) => ({
        ...prev,
        [field]: value,
      }));
    };

    const handleSubmit = () => {
      onUpdate(testExecution.id, updatedExecution);
      setEditMode(false);
    };

    const handleCancel = () => {
      setUpdatedExecution({ ...testExecution });
      setEditMode(false);
    };

    return (
      <>
        <tr className="border-b">
          <td className="p-2">
            <button onClick={() => setIsExpanded(!isExpanded)}>
              {isExpanded ? (
                <ChevronDownIcon className="h-5 w-5" />
              ) : (
                <ChevronRightIcon className="h-5 w-5" />
              )}
            </button>
          </td>
          <td className="p-2">{testExecution.testCaseId}</td>
          <td className="p-2">{testExecution.testCaseName}</td>
          <td className="p-2">{testExecution.platform}</td>
          <td className="p-2">
            {editMode ? (
              <FormSelect
                name="status"
                value={updatedExecution.status}
                options={getSelectOptions(testCaseStatuses, "id", "value")}
                onChange={(value) => handleInputChange("status", Number(value))}
              />
            ) : (
              testCaseStatuses.find((s) => s.id === testExecution.status)?.value
            )}
          </td>
          <td className="p-2">
            <div className="flex space-x-2">
              {editMode ? (
                <>
                  <button onClick={handleSubmit}>
                    <CheckIcon className="h-5 w-5 text-green-500" />
                  </button>
                  <button onClick={handleCancel}>
                    <XMarkIcon className="h-5 w-5 text-red-500" />
                  </button>
                </>
              ) : (
                <button onClick={() => setEditMode(true)}>
                  <svg
                    className="h-5 w-5 text-gray-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.536L16.732 3.732z"
                    />
                  </svg>
                </button>
              )}
              <button
                onClick={() =>
                  handleAddIssue(
                    testExecution.testCaseId,
                    testExecution.platform
                  )
                }
              >
                <PlusCircleIcon className="h-5 w-5 text-pink-400" />
              </button>
              <button
                onClick={() =>
                  handleIssueList(
                    testExecution.testCaseId,
                    testExecution.platform
                  )
                }
              >
                <span className="text-blue-500 underline">
                  {issueCount} Issues
                </span>
              </button>
            </div>
          </td>
        </tr>
        {isExpanded && (
          <tr>
            <td colSpan={6} className="p-4 bg-gray-50">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold">Expected Result:</h4>
                  <p>{testExecution.expectedResult || "N/A"}</p>
                </div>
                <div>
                  <h4 className="font-semibold">Actual Result:</h4>
                  {editMode ? (
                    <FormTextArea
                      name="actualResult"
                      value={updatedExecution.actualResult || ""}
                      onChange={(value) =>
                        handleInputChange("actualResult", value)
                      }
                    />
                  ) : (
                    <p>{testExecution.actualResult || "N/A"}</p>
                  )}
                </div>
              </div>
            </td>
          </tr>
        )}
      </>
    );
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">
          {testPlan.name || "Test Plan"} - Test Suite
        </h1>
        <button
          onClick={openTestSuiteEdit}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Edit Test Plan
        </button>
      </div>

      <div className="flex space-x-4 mb-6">
        <div className="w-1/4">
          <FormSelect
            label="Test Suite"
            name="testSuite"
            value={testSuiteID}
            options={getSelectOptions(testExecutionOptions, "id", "name")}
            onChange={handleSuiteChange}
          />
        </div>
        <div className="w-1/4">
          <FormSelect
            label="Test Cycle"
            name="testCycle"
            value={testCycleId}
            options={getSelectOptions(testExecutionCycles, "id", "name")}
            onChange={handleCycleChange}
          />
        </div>
      </div>

      <div className="flex space-x-4 mb-6">
        <StatusCount count={statusCounts.all} label="Total" />
        <StatusCount
          count={statusCounts.pass}
          label="Passed"
          variant="success"
        />
        <StatusCount
          count={statusCounts.fail}
          label="Failed"
          variant="danger"
        />
        <StatusCount
          count={statusCounts.pending}
          label="Pending"
          variant="warning"
        />
      </div>

      {testExecutionLoading || isUpdating ? (
        <SkeletonLoader />
      ) : testExecutions.length === 0 ? (
        <p>No test executions found for this suite and cycle.</p>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 text-gray-600 text-sm border-b">
              <th className="p-2 w-10"></th>
              <th className="p-2 text-left">Test Case ID</th>
              <th className="p-2 text-left">Test Case Name</th>
              <th className="p-2 text-left">Platform</th>
              <th className="p-2 text-left">Status</th>
              <th className="p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {testExecutions.map((execution) => (
              <TestExecutionRow
                key={execution.id}
                testExecution={execution}
                onUpdate={updateRow}
              />
            ))}
          </tbody>
        </table>
      )}

      <AddIssue
        isOpen={isOpenAddIssue}
        onClose={handleAddIssueClose}
        testSuiteID={testSuiteID}
        testCaseID={selectedTestCaseId}
        platform={selectedPlatform}
        fetchTestSuite={fetchTestSuite}
      />

      <IssueListPopup
        isOpen={isOpenIssueList}
        onClose={() => setIsIssueList(false)}
        testSuiteID={testSuiteID}
        testCaseID={selectedTestCaseId}
        platform={selectedPlatform}
      />
    </div>
  );
};

export default TestSuiteContentPage;
