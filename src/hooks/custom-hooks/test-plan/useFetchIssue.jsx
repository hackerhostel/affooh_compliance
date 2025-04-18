import { useEffect, useState } from "react";
import axios from "axios";
import { getCurrentUser } from "aws-amplify/auth";

const useFetchIssue = (testSuiteID) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [issueCount, setIssueCount] = useState({});
  const [token, setToken] = useState("");

  useEffect(() => {
    const getAuthToken = async () => {
      try {
        const currentSession = await getCurrentUser();
        if (currentSession) {
          setToken(
            currentSession.signInUserSession?.accessToken?.jwtToken || ""
          );
        }
      } catch (err) {
        console.error("Error getting auth token:", err);
        setError("Failed to authenticate user");
      }
    };

    getAuthToken();
  }, []);

  const fetchIssue = async () => {
    if (!testSuiteID || !token) return;

    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `https://dev-api.affooh.com/test-plans/test-suites/${testSuiteID}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.testSuite?.testCases?.length) {
        const testCasePromises = response.data.testSuite.testCases.map(
          async (testCase) => {
            try {
              const platforms = [
                ...new Set(
                  response.data.testSuite.testExecutions
                    .filter((exec) => exec.testCaseID === testCase.id)
                    .map((exec) => exec.platform)
                ),
              ];

              const platformPromises = platforms.map(async (platform) => {
                try {
                  const countResponse = await axios.get(
                    `https://dev-api.affooh.com/test-plans/test-suites/${testSuiteID}/issues/count`,
                    {
                      params: {
                        testCaseID: testCase.id,
                        platform: platform.toLowerCase(),
                      },
                      headers: { Authorization: `Bearer ${token}` },
                    }
                  );

                  const count =
                    typeof countResponse.data === "object"
                      ? Number(countResponse.data.count || 0)
                      : Number(countResponse.data || 0);

                  console.log(
                    `Frontend issue count for testCaseID: ${testCase.id}, platform: ${platform} => ${count}`
                  );

                  return { testCaseId: testCase.id, platform, count };
                } catch (err) {
                  console.error(
                    `Error fetching count for test case ${testCase.id} and platform ${platform}:`,
                    err
                  );
                  return { testCaseId: testCase.id, platform, count: 0 };
                }
              });

              return Promise.all(platformPromises);
            } catch (err) {
              console.error(`Error processing test case ${testCase.id}:`, err);
              return [];
            }
          }
        );

        const countsArray = await Promise.all(testCasePromises);
        const countMap = countsArray
          .flat()
          .reduce((acc, { testCaseId, platform, count }) => {
            acc[`${testCaseId}-${platform.toLowerCase()}`] = count;
            return acc;
          }, {});

        setIssueCount(countMap);
      } else {
        setIssueCount({});
      }
    } catch (err) {
      console.error("Error fetching issues:", err);
      setError(err.message || "Failed to fetch issues");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (testSuiteID && token) {
      fetchIssue();
    }
  }, [testSuiteID, token]);

  return { loading, error, issueCount, fetchIssue };
};

export default useFetchIssue;
