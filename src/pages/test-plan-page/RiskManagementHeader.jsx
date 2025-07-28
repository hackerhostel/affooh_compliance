import React, { useEffect, useState } from 'react'
import TaskCreateComponent from "../../components/task/create/TaskCreateComponent.jsx";
import FormInput from "../../components/FormInput.jsx";
import FormSelect from "../../components/FormSelect.jsx";
import DateRangeSelector from "../../components/DateRangeSelector.jsx";
import axios from "axios";
import { useToasts } from "react-toast-notifications";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { selectSelectedProject } from "../../state/slice/projectSlice.js";
import { doGetSprintBreakdown, setRedirectSprint } from "../../state/slice/sprintSlice.js";


const SprintHeader = ({
  sprint,
  isBacklog = false,
  refetchSprint,
  filters,
  assignees,
  statusList,
  sprintStatusList,
  onSelectFilterChange,
  onToggleFilterChange,
  configChanges,
  sprintConfig,
  setConfigChanges,
  epics,
  isKanban = false
}) => {
  const { addToast } = useToasts();
  const selectedProject = useSelector(selectSelectedProject);
  const dispatch = useDispatch();

  const [newTaskModalOpen, setNewTaskModalOpen] = useState(false);
  const [dateRangelOpen, setDateRangelOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [canClose, setCanClose] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState(sprint?.name || '');
  const [formValues, setFormValues] = useState({
    documentName: sprint?.name || ''
  });


  let sprintStatus = sprint?.status?.value || "OPEN"

  useEffect(() => {
    let complete;

    const requiredLabels = ['Done', 'All Status'];
    const filtered = statusList.filter(item => requiredLabels.includes(item.label));

    complete = !!(filtered.length === 2 && requiredLabels.every(label => filtered.some(item => item.label === label)));

    setCanClose((complete && sprintStatus !== "Done") || (!complete && sprintStatus === "Open"));

  }, [statusList]);

  const updateSprint = async (payload, successMessage, errorMessage, pullSprints = false) => {
    setIsSubmitting(true)
    try {
      const response = await axios.put(`/sprints/${sprint?.id}`, { sprint: payload })
      const updated = response?.data?.body

      if (updated) {
        addToast(successMessage, { appearance: 'success' });
        if (pullSprints) {
          dispatch(setRedirectSprint(sprint?.id));
          dispatch(doGetSprintBreakdown(selectedProject?.id))
        }
        await refetchSprint()
      } else {
        addToast(errorMessage, { appearance: 'error' });
      }
    } catch (error) {
      addToast(errorMessage, { appearance: 'error' });
    }

    setIsSubmitting(false)
  }



  const updateDisplayConfig = async () => {
    setIsSubmitting(true)
    try {
      const response = await axios.put(`/sprints/${sprint?.id}/config`, { config: sprintConfig })
      const updated = response?.data?.status

      if (updated) {
        addToast('Sprint display config updated', { appearance: 'success' });
        refetchSprint()
        setConfigChanges(false)
      } else {
        addToast('Failed update the sprint display config', { appearance: 'error' });
      }
    } catch (error) {
      addToast('Failed update the sprint display config', { appearance: 'error' });
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
    }, "Sprint Dates Successfully Updated", "Failed To Updated The Sprint Dates")
  }

  const updateSprintStatus = async () => {
    const statusID = (() => {
      const targetValue = sprintStatus === "Open" ? "In Progress" : "Done";
      const status = sprintStatusList?.find(sl => sl.value === targetValue);
      return status?.id;
    })();

    await updateSprint({
      sprintID: sprint?.id,
      statusID: statusID
    }, sprintStatus === "Open" ? "Sprint Started" : "Sprint Completed", sprintStatus === "Open" ? "Failed To Start The Sprint" : "Failed To Complete The Sprint", true)
  }


  return (
    <>
      <div className="flex flex-col p-4 gap-4">
        <div className="bg-white p-4 rounded-lg">
          <div className='flex items-center gap-12'>
            <div className='w-64'>
              <label className='text-sm font-medium'>Document Name</label>
              <FormInput
                name="documentName"
                formValues={formValues}
                onChange={(e) => setFormValues({ ...formValues, documentName: e.target.value })}
              />
            </div>

            <div className='w-64'>
              <label className='text-sm font-medium'>Author</label>
              <FormInput
                name="author"
                formValues={formValues}
                onChange={(e) => setFormValues({ ...formValues, documentName: e.target.value })}
              />
            </div>

            <div className='w-64'>
              <label className='text-sm font-medium'>Version</label>
              <FormSelect
                name="version"
                options={[]}
                formValues={formValues}
                onChange={(e) => setFormValues({ ...formValues, version: e.target.value })}
              />
            </div>

            <div className='w-64'>
              <label className='text-sm font-medium'>Owner</label>
              <FormSelect
                name="owner"
                options={[]}
                formValues={formValues}
                onChange={(e) => setFormValues({ ...formValues, version: e.target.value })}
              />
            </div>
          </div>
        </div>

        <div className='bg-white p-4 flex rounded-lg space-x-6'>
          <div className="flex gap-4">
            <div className='border-2 border-secondary-bcg rounded-lg px-24 py-8'>
              <div className='flex flex-col items-center gap-1 text-text-color'>
                <span className='text-3xl font-medium'>25</span>
                <span className='text-lg font-medium'>All</span>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <div className='border-2 border-pass-border-color rounded-lg px-24 py-8'>
              <div className='flex flex-col items-center gap-1 text-text-color'>
                <span className='text-3xl font-medium'>25</span>
                <span className='text-lg font-medium'>Pass</span>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <div className='border-2 border-priority-high rounded-lg px-24 py-8'>
              <div className='flex flex-col items-center gap-1 text-text-color'>
                <span className='text-3xl font-medium'>12</span>
                <span className='text-lg font-medium'>Fail</span>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <div className='border-2 border-pending-border-color rounded-lg px-24 py-8'>
              <div className='flex flex-col items-center gap-1  text-text-color'>
                <span className='text-3xl font-medium'>25</span>
                <span className='text-lg font-medium'>Pending</span>
              </div>
            </div>
          </div>
        </div>
      </div>

    </>
  );
}

export default SprintHeader;