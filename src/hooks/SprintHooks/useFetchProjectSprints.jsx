import {useEffect, useState} from 'react';
import useGraphQL from "../useGraphQL.jsx";
import {listSprintsByProject} from "../../graphql/sprintQueries/queries.js";

export const useFetchProjectSprints = (projectID) => {
    const {makeRequest} = useGraphQL();
    const [sprints, setSprints] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSprints = async () => {
            if (projectID) {
                setLoading(true);
                setError(null);
                try {
                    const variables = {projectID};
                    const response = await makeRequest(listSprintsByProject, variables);
                    const sprints = response?.data?.listSprintsByProject;
                    setSprints(sprints || []);
                } catch (err) {
                    setError(err);
                    setSprints([]);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchSprints();
    }, [projectID]);

    return {sprints, loading, error};
};
