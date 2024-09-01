import axios from 'axios';
import {useEffect, useState} from 'react';

const useFetchTestExecution = (testSuiteID, testCycleID) => {
    const [data, setData] = useState({});
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchTestExecution = async () => {
            setLoading(true)
            setError(false)
            try {
                const response = await axios.get(`/test-plans/test-suites/${testSuiteID}/test-cycle/${testCycleID}`)
                const testExecutionResponse = response?.data?.testExecutionData;

                if (testExecutionResponse.length) {
                    setLoading(false)
                    setData(testExecutionResponse)
                }
            } catch (error) {
                setError(true)
                setLoading(false)
            }
        };

        if (testCycleID !== 0) {
            fetchTestExecution()
        }
    }, [testCycleID]);

    return {data, error, loading};
};

export default useFetchTestExecution;
