import React, {useState} from 'react'
import TaskForm from "../../components/task/create/CreateTask.jsx";
import timeCalender from '../../assets/Time_Calender.png'
import EditIcon from '../../assets/Edit_Icon.png'
import {formatShortDate} from "../../utils/commonUtils.js";
import ToggleButton from "../../components/ToggleButton.jsx";
import FormSelect from "../../components/FormSelect.jsx";
import {PlusCircleIcon} from "@heroicons/react/24/outline/index.js";
import DateRangeSelector from "../../components/DateRangeSelector.jsx";
import axios from "axios";
import {useToasts} from "react-toast-notifications";
import moment from "moment";

const SprintHeader = ({sprint, isBacklog, refetchSprint, filters, onFilterChange, assignees, statusList}) => {
  const {addToast} = useToasts();
  const [newTaskModalOpen, setNewTaskModalOpen] = useState(false);
  const [dateRangelOpen, setDateRangelOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateSprint = async (payload, toUpdate) => {
    setIsSubmitting(true)
    try {
      const response = await axios.put(`/sprints/${sprint?.id}`, {sprint: payload})
      const updated = response?.data?.body

      if (updated) {
        addToast(`${toUpdate} Successfully Updated`, {appearance: 'success'});
        await refetchSprint()
      } else {
        addToast(`Failed To Updated The ${toUpdate}`, {appearance: 'error'});
      }
    } catch (error) {
      addToast(`Failed To Updated The ${toUpdate}`, {appearance: 'error'});
    }

    setIsSubmitting(false)
  }

  const closeCreateTaskModal = () => setNewTaskModalOpen(false)
  const closeDateRange = () => setDateRangelOpen(false)

  const updateDateRange = async (dateRange) => {
    closeDateRange()
    await updateSprint({
      sprintID: sprint?.id,
      startDate: moment(dateRange?.startDate).format('YYYY-MM-DD'),
      endDate: moment(dateRange?.endDate).format('YYYY-MM-DD'),
    }, "Sprint Dates")
  }

  const onToggleFilterChange = (e, name) => {
    const tempFilters = {...filters, [name]: e?.target?.checked}
    onFilterChange(tempFilters)
  }

  const onSelectFilterChange = (value, name) => {
    const tempFilters = {...filters, [name]: Number(value)}
    onFilterChange(tempFilters)
  }

  return (
      <>
        <div className="flex flex-col p-4 gap-4">
          <div className="flex w-full bg-white h-12 rounded-lg justify-between">
            <div className="flex justify-start items-center">
              <div
                  className=" flex text-white text-center bg-primary-pink pl-5 pr-14 rounded-l-lg font-semibold h-12 items-center">
                <p>{sprint?.name}</p>
              </div>
              <div className="flex text-status-done font-medium pl-4 pr-5 gap-2">
                <div className={"min-w-1 rounded-md bg-status-done"}></div>
                <p>{sprint?.status?.value || "OPEN"}</p></div>
              <div className="flex items-center">
                <div className="h-7 w-px bg-gray-500 mr-4"></div>
                <img
                    src={timeCalender}
                    alt="Time Calender"
                    className="max-w-5"
                />
                <p className="ml-3 text-text-color mr-2.5">{formatShortDate(sprint?.startDate)} - {formatShortDate(sprint?.endDate)}</p>
                <img
                    src={EditIcon}
                    alt="Edit Icon"
                    className={`max-w-4 ${isBacklog ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                    onClick={() => {
                      if (!isBacklog) {
                        setDateRangelOpen(true);
                      }
                    }}
                />
              </div>
            </div>
            <div className="flex justify-end h-12 items-center gap-8 pr-2">
              <ToggleButton label={"Epics"} onChange={e => onToggleFilterChange(e, 'epic')} checked={filters?.epic}/>
              <ToggleButton label={"Completed Tasks"} onChange={e => onToggleFilterChange(e, 'completed')}
                            checked={filters?.completed}/>
              <ToggleButton label={"Sub Tasks"} onChange={e => onToggleFilterChange(e, 'sub')}
                            checked={filters?.sub}/>
            </div>
          </div>

          <div className="flex w-full h-12 justify-between">
            <div className="flex items-center">
              <div className={"flex-col min-w-44"}>
                <FormSelect
                    name="assignee"
                    formValues={{assignee: filters?.assignee}}
                    options={assignees}
                    onChange={({target: {name, value}}) => onSelectFilterChange(value, name)}
                />
              </div>
              <div className={"flex-col ml-3 min-w-32"}>
                <FormSelect
                    name="status"
                    formValues={{status: filters?.status}}
                    options={statusList}
                    onChange={({target: {name, value}}) => onSelectFilterChange(value, name)}
                />
              </div>

              <div className="flex items-center space-x-2 ml-10 border border-gray-300 p rounded-full">
                <div className="avatar-group flex -space-x-5">
                  <img src="https://via.placeholder.com/24"
                       className="w-8 h-8 rounded-full border-2 border-white"
                       alt="User Avatar"/>
                  <img src="https://via.placeholder.com/24"
                       className="w-8 h-8 rounded-full border-2 border-white"
                       alt="User Avatar"/>
                  <span
                      className="bg-white w-8 h-8 rounded-full flex items-center justify-center text-primary-pink text-xs border-2 border-white">+11</span>
                </div>
                <div className="h-7 w-px bg-gray-300 mr-4"></div>
                <div className={"flex items-center mr-5"}>
                  <PlusCircleIcon className={"w-9 h-9 text-pink-500 cursor-pointer"}/>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button
                  className="px-6 py-3 text-primary-pink rounded-lg border border-primary-pink cursor-pointer disabled:cursor-not-allowed disabled:text-gray-300 disabled:border-gray-300"
                  disabled={true}
              >Save
              </button>
              <button
                  className="px-6 py-3 text-primary-pink rounded-lg border border-primary-pink cursor-pointer disabled:cursor-not-allowed disabled:text-gray-300 disabled:border-gray-300">
                Complete Sprint
              </button>
              <button
                  className="px-6 py-3 text-white rounded-lg border border-primary-pink bg-primary-pink cursor-pointer disabled:cursor-not-allowed disabled:text-gray-300 disabled:border-gray-300"
                  onClick={() => setNewTaskModalOpen(true)}>
                New Task
              </button>
            </div>
          </div>
        </div>

        <TaskForm sprintId={sprint?.id} onClose={closeCreateTaskModal} isOpen={newTaskModalOpen}/>
        <DateRangeSelector isOpen={dateRangelOpen} onClose={closeDateRange} startDate={sprint?.startDate}
                           endDate={sprint?.endDate} onSave={updateDateRange}/>
      </>
  );
}

export default SprintHeader;