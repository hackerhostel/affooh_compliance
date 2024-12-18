import {Tab, TabGroup, TabList, TabPanel, TabPanels} from '@headlessui/react'
import React from "react";
import EditScreenTabField from "./EditScreenTabField.jsx";

const EditTaskScreenDetails =
  ({
       isEditing,
       initialTaskData,
       handleFormChange,
       isValidationErrorsShown,
       screenDetails,
       updateTaskAttribute,
       users,
       taskAttributes
   }) => {
    return (
      <div className="w-full bg-white rounded-md">
        <TabGroup>
          <TabPanels className="mt-5 p-5 rounded-sm">
              {screenDetails?.tabs.map(({id, name, fields}) => (
                  <TabPanel key={id} className="rounded-xl bg-white/5">
                      <div className="gap-4">
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
                                          isValidationErrorsShown={isValidationErrorsShown}
                                          updateTaskAttribute={updateTaskAttribute}
                                          tabName={name}
                                          users={users}
                                          taskAttributes={taskAttributes}
                                          initialAttributeData={initialTaskData?.attributes}
                                      />
                                  ))
                              : fields.map((field) => (
                                  <EditScreenTabField
                                      key={field.id}
                                      isEditing={isEditing}
                                      field={field}
                                      onChange={handleFormChange}
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