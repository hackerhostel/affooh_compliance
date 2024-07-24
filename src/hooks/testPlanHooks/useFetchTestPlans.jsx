import {useEffect, useState} from 'react';
import useGraphQL from "../useGraphQL.jsx";
import {listTestPlansByProject} from "../../graphql/TestPlanQueries/queries.js";

export const useFetchTestPlans = (projectID) => {
    const {makeRequest} = useGraphQL();
    const [testPlans, setTestPlans] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect( () => {
        const fetchTestPlans = async () => {
            if (projectID) {
                setLoading(true);
                setError(null);
                try {
                    const variables = {projectID};
                    const response = await makeRequest(listTestPlansByProject, variables);
                    const testPlans = response?.data?.listTestPlansByProject;
                    setTestPlans(testPlans || []);
                } catch (err) {
                    setError(err);
                    setTestPlans([]);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchTestPlans();
    }, [projectID]);

    return {testPlans, loading, error};
};
