import React, {useState} from 'react'
import {useSelector} from "react-redux";
import {selectSelectedProjectFromList} from "../../state/slice/projectSlice.js";
import SprintTable from "../../components/sprint-table/index.jsx";

const SprintContentPage = () => {
  const selectedProject = useSelector(selectSelectedProjectFromList);

  // if(!selectedProject) {
  //   return <div className="p-4 text-center">No Details</div>
  // }

  const [typeFilter, setTypeFilter] = useState('All');
  const [hideSub, setHideSub] = useState(true);
  const [hideDone, setHideDone] = useState(true);
  const [hideEpic, setHideEpic] = useState(true);

  // Mock data
  const metaData = {
    currentSprint: {
      name: 'Sprint 1',
      status: 'In Progress',
      createdAt: '2024-08-01',
      endDate: '2024-08-15'
    },
    project_id: 'proj123'
  };

  const assigneeList = ['John Doe', 'Jane Smith', 'Bob Johnson'];
  const typeList = ['Bug', 'Feature', 'Task'];
  const isDue = true;
  const filterGroupChanged = true;
  const showSprintMangeBtn = true;
  const data = [{ id: 1 }]; // Mock data array
  const disableSprintMange = false;
  const sprintMangeText = 'Manage Sprint';
  const isBacklog = false;

  const handleTypeFilterChange = (e) => setTypeFilter(e.target.value);
  const handleHideSub = (value) => setHideSub(value);
  const handleHideDone = (value) => setHideDone(value);
  const handleHideEpic = (value) => setHideEpic(value);

  const handleSaveGrouping = () => {
    console.log('Save grouping');
  };

  const handleSprintMangeBtn = () => {
    console.log('Manage sprint');
  };

  const handleCreateTask = () => {
    console.log('Create task');
  };

  return (
    <>
      <div className="p-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="flex items-center mb-2">
              <h2 className="text-xl font-bold mr-2">{metaData.currentSprint?.name}</h2>
              <span className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs">
              {metaData.currentSprint?.status}
            </span>
            </div>
            {!isBacklog && (
              <div className="flex items-center text-gray-600 mb-4">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                     xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <span className="text-sm">
                {/*{moment(metaData.currentSprint?.createdAt).format('DD MMM')} - {moment(metaData.currentSprint?.endDate).format('DD MMM')}*/}
              </span>
              </div>
            )}
            <div className="flex items-center mt-10">
              {assigneeList.map((item, index) => (
                <div key={index} className="w-8 h-8 bg-gray-300 rounded-full mr-2"></div>
              ))}
              <select
                className="ml-2 border rounded px-2 py-1"
                value={typeFilter}
                onChange={handleTypeFilterChange}
              >
                <option value="All">All</option>
                {typeList.map((item, index) => (
                  <option key={index} value={item}>{item}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <div className="flex justify-end mb-4">
              {isDue && (
                <span
                  className="bg-white text-gray-600 border border-gray-300 px-2 py-1 rounded-full text-xs uppercase mr-2">
                due
              </span>
              )}
              {filterGroupChanged && (
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
                  onClick={handleSaveGrouping}
                >
                  View
                </button>
              )}
              {showSprintMangeBtn && data.length > 0 && (
                <button
                  className="bg-pink-500 text-white px-4 py-2 rounded mr-2"
                  onClick={handleSprintMangeBtn}
                  disabled={disableSprintMange}
                >
                  {sprintMangeText}
                </button>
              )}
              <button
                className="bg-green-500 text-white px-4 py-2 rounded"
                onClick={handleCreateTask}
              >
                Task
              </button>
            </div>
          </div>
        </div>
      </div>

      <SprintTable/>
    </>
  );
}

export default SprintContentPage;