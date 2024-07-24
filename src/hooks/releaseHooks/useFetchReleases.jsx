import {useEffect, useState} from 'react';
import useGraphQL from "../useGraphQL.jsx";
import {listReleasesByProject} from "../../graphql/releaseQueries/queries.js";

export const useFetchReleases = (projectID) => {
    const {makeRequest} = useGraphQL();
    const [releases, setReleases] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchReleases = async () => {
            if (projectID) {
                setLoading(true);
                setError(null);
                try {
                    const variables = {projectID};
                    const response = await makeRequest(listReleasesByProject, variables);
                    const releases = response?.data?.listReleasesByProject;
                    setReleases(releases || []);
                } catch (err) {
                    setError(err);
                    setReleases([]);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchReleases();
    }, [projectID]);

    return {releases, loading, error};
};
