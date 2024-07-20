import React, {useEffect, useState} from 'react';
import useGraphQL from "../../hooks/useGraphQL.jsx";
import {listUsersByOrganization} from "../../graphql/userQueries/queries.js";
import SkeletonLoader from "../../components/SkeletonLoader.jsx";
import {useDispatch} from "react-redux";
import {setSelectedProject} from "../../state/slice/projectSlice.js";

const UserListPage = () => {
  const dispatch = useDispatch();
  const { makeRequest, loading, error } = useGraphQL();

  const [exampleList, setExampleList] = useState();

  useEffect(() => {
    const fetchData = async () => {
      const query = listUsersByOrganization;
      const variables = { /* your query variables */ }; // not mandatory
      const data = await makeRequest(query, variables);

      setExampleList(data.data.listUsersByOrganization)
    };

    fetchData();
  }, []);

  if (loading) return <div className="p-2"><SkeletonLoader /></div>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="h-list-screen overflow-y-auto">
      <div className="flex flex-col gap-2 p-2">
        {exampleList && Array.isArray(exampleList) && exampleList.map((element, index) => (
          <button
            key={index}
            className="p-3 border border-gray-200 rounded-md"
            onClick={() => {
              dispatch(setSelectedProject(index))
            }}
          >
            {`${element?.firstName} ${element?.lastName}`}
          </button>
        ))}
      </div>
    </div>
  );
};

export default UserListPage;