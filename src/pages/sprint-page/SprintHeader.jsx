import React, {useState} from 'react'
import Modal from "../../components/Modal.jsx";
import TaskForm from "../../components/task/create/CreateTask.jsx";
import SampleModalContent from "../../components/SampleModalContent.jsx";

const SprintHeader = ({sprintDetails}) => {
  const [newTaskModalOpen, setNewTaskModalOpen] = useState(false);

  const filterGroupChanged = true;
  const showSprintMangeBtn = true;
  const data = [{id: 1}]; // Mock data array
  const disableSprintMange = false;

  const closeCreateTaskModal = () => setNewTaskModalOpen(false)

  return (
    <>
      <div className="p-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="flex items-center mb-2">
              <h2 className="text-xl font-bold mr-2">{sprintDetails?.name}</h2>
              <span className="bg-primary-pink text-white px-2 py-1 rounded-full text-xs">
              {sprintDetails?.status?.value}
            </span>
            </div>
          </div>
          <div>
            <div className="flex justify-end mb-4">
              {filterGroupChanged && (
                <button
                  className="bg-secondary-grey text-white px-4 py-2 rounded mr-2"
                  onClick={() => {}}
                >
                  View
                </button>
              )}
              {showSprintMangeBtn && data.length > 0 && (
                <button
                  className="bg-primary-pink text-white px-4 py-2 rounded mr-2"
                  onClick={() => {}}
                  disabled={() => {}}
                >
                  Manage Sprint
                </button>
              )}
              <button
                className="bg-primary-pink text-white px-4 py-2 rounded"
                onClick={() => setNewTaskModalOpen(true)}
              >
                New Task
              </button>
            </div>
          </div>
        </div>
      </div>

      <Modal
        title={'Create New Task'}
        isOpen={newTaskModalOpen}
        onClose={closeCreateTaskModal}
        type='side'
      >
        <TaskForm sprintId={sprintDetails?.id} onClose={closeCreateTaskModal} />
      </Modal>
    </>
  );
}

export default SprintHeader;