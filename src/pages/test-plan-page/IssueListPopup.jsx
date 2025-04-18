import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  doGetIssues,
  selectIssues,
  selectIsIssuesLoading,
  selectIsIssuesError,
} from "../../state/slice/testIssueSlice";

const IssueListPopup = ({
  isOpen,
  onClose,
  testSuiteID,
  testCaseID,
  token,
  platform,
}) => {
  const dispatch = useDispatch();
  const issues = useSelector(selectIssues);
  const isLoading = useSelector(selectIsIssuesLoading);
  const isError = useSelector(selectIsIssuesError);

  useEffect(() => {
    if (isOpen && testSuiteID && token && testCaseID) {
      console.log(
        `Fetching issues with testCaseID: ${testCaseID}, platform: ${platform}`
      );
      dispatch(
        doGetIssues({
          testSuiteID,
          token,
          testCaseID,
          platform,
        })
      );
    }
  }, [isOpen, dispatch, testSuiteID, testCaseID, token, platform]);

  useEffect(() => {
    if (issues) {
      console.log(
        `Frontend fetched issues for testCaseID: ${testCaseID}, platform: ${platform} => ${issues.length} issues`
      );
    }
  }, [issues, testCaseID, platform]);

  const renderAssignee = (assignee) => {
    if (!assignee) return "Unassigned";

    const firstInitial = assignee.firstName
      ? assignee.firstName.charAt(0)
      : "N";
    const fullName = assignee.firstName
      ? `${assignee.firstName} ${assignee.lastName || ""}`
      : "Nilanga";

    return (
      <div className="flex items-center space-x-2">
        <div className="w-6 h-6 rounded-full bg-gray-300 text-gray-700 flex items-center justify-center">
          {firstInitial}
        </div>
        <span>{fullName}</span>
      </div>
    );
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-[600px]">
            <div className="flex justify-end items-center border-b pb-2">
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={onClose}
              >
                ✖
              </button>
            </div>

            <div className="mt-4">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="text-gray-500 text-sm border-b">
                    <th className="text-left p-2">ID</th>
                    <th className="text-left p-2">Type</th>
                    <th className="text-left p-2">Summary</th>
                    <th className="text-left p-2">Assignee</th>
                    <th className="text-left p-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td colSpan={5} className="p-2 text-center">
                        Loading issues...
                      </td>
                    </tr>
                  ) : isError ? (
                    <tr>
                      <td colSpan={5} className="p-2 text-center text-red-500">
                        Error loading issues. Please try again.
                      </td>
                    </tr>
                  ) : issues.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-2 text-center">
                        No issues linked to this test case.
                      </td>
                    </tr>
                  ) : (
                    issues.flatMap((issue) =>
                      issue.tasks.map((task) => (
                        <tr key={`${issue.id}-${task.id}`} className="border-b">
                          <td className="p-2">{task.id}</td>
                          <td className="p-2">{task.type || "Bug"}</td>
                          <td className="p-2">{task.summary}</td>
                          <td className="p-2">
                            {renderAssignee(issue.createdBy)}
                          </td>
                          <td className="p-2">
                            {task.status?.value || "To Do"}
                          </td>
                        </tr>
                      ))
                    )
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default IssueListPopup;
