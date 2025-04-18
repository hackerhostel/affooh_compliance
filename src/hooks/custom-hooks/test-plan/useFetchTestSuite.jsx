import { useEffect, useState } from "react";
import axios from "axios";
import { getCurrentUser } from "aws-amplify/auth";

const useFetchTestSuite = (testSuiteID) => {
  const [testSuite, setTestSuite] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
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

  const fetchTestSuite = async () => {
    if (!testSuiteID || !token) return;

    setLoading(true);
    setError(null);
    try {
      const user = await getCurrentUser();
      const email = user.signInDetails?.loginId;

      if (!email) {
        throw new Error("User email not available");
      }

      const response = await axios.get(
        `https://dev-api.affooh.com/test-plans/test-suites/${testSuiteID}`,
        {
          params: { email },
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setTestSuite(response.data.testSuite);
    } catch (err) {
      console.error("Error fetching test suite:", err);
      setError(err.message || "Failed to fetch test suite");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (testSuiteID && token) {
      fetchTestSuite();
    }
  }, [testSuiteID, token]);

  return { testSuite, loading, error, fetchTestSuite, token };
};

export default useFetchTestSuite;
