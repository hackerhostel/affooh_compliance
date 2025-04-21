import axios from "axios";
import { useEffect, useState } from "react";

const useFetchIssue = (testSuiteID) => {
  const [data, setData] = useState({});
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchIssue = async () => {
    if (!testSuiteID) return;

    setLoading(true);
    setError(false);

    try {
      const response = await axios.get(
        `/test-plans/test-suites/${testSuiteID}`
      );
      const testSuiteResponse = response?.data?.testSuite;

      if (testSuiteResponse?.testCases?.length) {
        const testCasePromises = testSuiteResponse.testCases.map(
          async (testCase) => {
            try {
              const platforms = [
                ...new Set(
                  testSuiteResponse.testExecutions
                    .filter((exec) => exec.testCaseID === testCase.id)
                    .map((exec) => exec.platform)
                ),
              ];

              const platformPromises = platforms.map(async (platform) => {
                try {
                  const countResponse = await axios.get(
                    `/test-plans/test-suites/${testSuiteID}/issues/count`,
                    {
                      params: {
                        testCaseID: testCase.id,
                        platform: platform.toLowerCase(),
                      },
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

        setData(countMap);
        setLoading(false);
      } else {
        setData({});
        setLoading(false);
      }
    } catch (err) {
      console.error("Error fetching issues:", err);
      setError(true);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (testSuiteID) {
      fetchIssue();
    }
  }, [testSuiteID]);

  return { data, error, loading, refetch: fetchIssue };
};

export default useFetchIssue;
