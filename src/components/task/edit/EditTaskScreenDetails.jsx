import {Tab, TabGroup, TabList, TabPanel, TabPanels} from '@headlessui/react'
import React from "react";
import EditScreenTabField from "./EditScreenTabField.jsx";

const EditTaskScreenDetails =
  ({
       isEditing,
       initialTaskData,
       taskFormData,
       handleFormChange,
       isValidationErrorsShown,
       screenDetails,
       updateTaskAttribute,
       users,
       taskAttributes
   }) => {
    return (
      <div className="w-full">
        <TabGroup>
          <TabList className="flex gap-4 mt-5">
            {screenDetails?.tabs.map(({id, name}) => (
              <Tab
                key={id}
                className="rounded-full py-1 px-3 text-sm/6 font-semibold bg-gray-900 text-white focus:outline-none data-[selected]:bg-primary-pink data-[hover]:bg-secondary-grey data-[selected]:data-[hover]:bg-primary-pink data-[focus]:outline-1 data-[focus]:outline-white"
              >
                {name}
              </Tab>
            ))}
          </TabList>
          <TabPanels className="mt-5 rounded-md">
              {screenDetails?.tabs.map(({id, name, fields}) => (
                  <TabPanel key={id} className="rounded-xl bg-white/5">
                      <div className="grid grid-cols-3 gap-4">
                          {name === "General"
                              ? fields
                                  .filter((field) => {
                                      return (
                                          field.name !== "Task Owner" &&
                                          field.name !== "Predecessors" &&
                                          field.name !== "Labels" &&
                                          field.name !== "Estimation"
                                      );
                                  })
                                  .map((field) => (
                                      <EditScreenTabField
                                          key={field.id}
                                          isEditing={isEditing}
                                          field={field}
                                          onChange={handleFormChange}
                                          initialTaskData={initialTaskData}
                                          formValues={taskFormData}
                                          isValidationErrorsShown={isValidationErrorsShown}
                                          updateTaskAttribute={updateTaskAttribute}
                                          tabName={name}
                                          users={users}
                                          taskAttributes={taskAttributes}
                                      />
                                  ))
                              : fields.map((field) => (
                                  <EditScreenTabField
                                      key={field.id}
                                      isEditing={isEditing}
                                      field={field}
                                      onChange={handleFormChange}
                                      initialTaskData={initialTaskData}
                                      formValues={taskFormData}
                                      isValidationErrorsShown={isValidationErrorsShown}
                                      updateTaskAttribute={updateTaskAttribute}
                                      tabName={name}
                                      users={users}
                                  />
                              ))}
                      </div>
                  </TabPanel>
              ))}
          </TabPanels>
        </TabGroup>
      </div>
    )
  }

export default EditTaskScreenDetails;