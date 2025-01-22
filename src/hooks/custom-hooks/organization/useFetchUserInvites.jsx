import axios from 'axios';
import {useEffect, useState} from 'react';

const useFetchUserInvites = (email) => {
    const [data, setData] = useState({});
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);

    const fetchUserInvites = async () => {
        setLoading(true)
        setError(false)
        try {
            const response = await axios.get(`/users/complete-registration/${email}`)
            const inviteResponse = response?.data?.body;

            console.log(inviteResponse)

            // if (testPlanResponse?.id) {
            //     setLoading(false)
            //     setData(testPlanResponse)
            // }
        } catch (error) {
            setError(true)
            setLoading(false)
        }
    };

    useEffect(() => {
        console.log("hdgd")
        console.log(email)
        if (email && email !== '') {
            console.log("sssss")
            fetchUserInvites()
        }
    }, [email]);

    return {data, error, loading, refetch: fetchUserInvites};
};

export default useFetchUserInvites;
