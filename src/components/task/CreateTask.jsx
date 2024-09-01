import React, {useRef, useState} from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { ChevronUpDownIcon } from '@heroicons/react/20/solid';

import FormInput from "../FormInput.jsx";
import useValidation from "../../utils/use-validation.jsx";
import {LoginSchema} from "../../state/domains/authModels.js";
import FormSelect from "../FormSelect.jsx";

const priorities = ['Low', 'Medium', 'High'];

const TaskForm = () => {
  const [loginDetails, setLoginDetails] = useState({ username: '', password: '' });
  const [isValidationErrorsShown, setIsValidationErrorsShown] = useState(false);
  const formRef = useRef(null);
  const [formErrors] = useValidation(LoginSchema, loginDetails);

  const handleFormChange = (name, value) => {
    const newForm = { ...loginDetails, [name]: value };
    setLoginDetails(newForm);
  };

  return (
    <div className="w-[39rem] mx-auto p-2 bg-white shadow-sm rounded-lg">
      <form className="space-y-4">
        <div className="mb-6">
          <FormSelect
            showLabel
            placeholder="Task Type"
            name="Status"
            formValues={loginDetails}
            options={['In Progress', 'Completed', 'On Hold']}
            onChange={({target: {name, value}}) => handleFormChange(name, value)}
          />
        </div>

        <div className="mb-6">
          <FormInput
            type="text"
            name="username"
            formValues={loginDetails}
            placeholder="Task Title"
            onChange={({target: {name, value}}) => handleFormChange(name, value)}
            formErrors={formErrors}
            showErrors={isValidationErrorsShown}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <div className="border border-gray-300 rounded-md p-2">
            <div className="flex space-x-2 mb-2">
              <button type="button" className="p-1 rounded hover:bg-gray-100">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"
                     className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/>
                </svg>
              </button>
              {/* Add more formatting buttons here */}
            </div>
            <div className="mb-6">
              <FormInput
                type="text"
                name="username"
                formValues={loginDetails}
                onChange={({target: {name, value}}) => handleFormChange(name, value)}
                formErrors={formErrors}
                showErrors={isValidationErrorsShown}
              />
            </div>
          </div>
        </div>

        <div className="mb-6">
          <FormSelect
            showLabel
            placeholder="Epic"
            name="epic"
            formValues={loginDetails}
            options={['In Progress', 'Completed', 'On Hold']}
            onChange={({target: {name, value}}) => handleFormChange(name, value)}
          />
        </div>

        <div className="flex space-x-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Assignee</label>
            <div className="flex items-center space-x-2">
              {/*TODO: need a way to get profile avatar*/}
              {/*{userDetails.avatar ? (*/}
              {/*  <img*/}
              {/*    src={userDetails.avatar}*/}
              {/*    alt={`${userDetails.firstName} ${userDetails.lastName}`}*/}
              {/*    className="w-7 h-7 rounded-full object-cover"*/}
              {/*  />*/}
              {/*) : (*/}
              {/*  <div*/}
              {/*    className="w-7 h-7 rounded-full bg-primary-pink flex items-center justify-center text-white text-xl font-semibold">*/}
              {/*    {userDetails.firstName?.[0]}{userDetails.lastName?.[0]}*/}
              {/*  </div>*/}
              {/*)}*/}
              <span className="text-sm text-gray-600">Alex s.</span>
              <button type="button" className="text-gray-400 hover:text-gray-600">×</button>
            </div>
          </div>
          <div className="mb-6">
            <FormInput
              type="text"
              name="username"
              formValues={loginDetails}
              placeholder="Task Owner"
              onChange={({target: {name, value}}) => handleFormChange(name, value)}
              formErrors={formErrors}
              showErrors={isValidationErrorsShown}
            />
          </div>
        </div>

        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"
               className="w-6 h-6 mx-auto text-gray-400">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/>
          </svg>
          <p className="mt-1 text-sm text-gray-500">Drop attachment or <span
            className="text-pink-500">browse files</span></p>
        </div>

        <div className="font-medium text-gray-700">General</div>

        <div className="grid grid-cols-3 gap-4">
          <div className="mb-6">
            <FormSelect
              showLabel
              placeholder="Status"
              name="Status"
              formValues={loginDetails}
              options={['In Progress', 'Completed', 'On Hold']}
              onChange={({target: {name, value}}) => handleFormChange(name, value)}
            />
          </div>

            <Listbox value={priorities[1]}>
              {({open}) => (
                <div className="relative">
                  <Listbox.Label className="block text-sm font-medium text-gray-700 mb-1">Priority</Listbox.Label>
                  <Listbox.Button
                    className="relative w-full bg-white border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-pink-500 focus:border-pink-500 sm:text-sm">
                    <span className="block truncate">{priorities[1]}</span>
                    <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                    <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true"/>
                  </span>
                  </Listbox.Button>
                  <Transition
                    show={open}
                    enter="transition duration-100 ease-out"
                    enterFrom="transform scale-95 opacity-0"
                    enterTo="transform scale-100 opacity-100"
                    leave="transition duration-75 ease-out"
                    leaveFrom="transform scale-100 opacity-100"
                    leaveTo="transform scale-95 opacity-0"
                  >
                    <Listbox.Options
                      className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                      {priorities.map((priority) => (
                        <Listbox.Option
                          key={priority}
                          className={({active}) =>
                            `${active ? 'text-white bg-pink-600' : 'text-gray-900'}
                          cursor-default select-none relative py-2 pl-3 pr-9`
                          }
                          value={priority}
                        >
                          {({selected, active}) => (
                            <>
                            <span className={`${selected ? 'font-semibold' : 'font-normal'} block truncate`}>
                              {priority}
                            </span>
                              {selected && (
                                <span
                                  className={`${active ? 'text-white' : 'text-pink-600'}
                                  absolute inset-y-0 right-0 flex items-center pr-4`}
                                >
                                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
                                     fill="currentColor">
                                  <path fillRule="evenodd"
                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                        clipRule="evenodd"/>
                                </svg>
                              </span>
                              )}
                            </>
                          )}
                        </Listbox.Option>
                      ))}
                    </Listbox.Options>
                  </Transition>
                </div>
              )}
            </Listbox>

            <div className="mb-6">
              <FormInput
                type="text"
                name="username"
                formValues={loginDetails}
                placeholder="Estimation"
                onChange={({target: {name, value}}) => handleFormChange(name, value)}
                formErrors={formErrors}
                showErrors={isValidationErrorsShown}
              />
            </div>
          </div>

          <div className="mb-6">
            <FormInput
              type="text"
              name="username"
              formValues={loginDetails}
              placeholder="Labels"
              onChange={({target: {name, value}}) => handleFormChange(name, value)}
              formErrors={formErrors}
              showErrors={isValidationErrorsShown}
            />
          </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="mb-6">
            <FormInput
              type="date"
              name="username"
              formValues={loginDetails}
              placeholder="Start Date"
              onChange={({target: {name, value}}) => handleFormChange(name, value)}
              formErrors={formErrors}
              showErrors={isValidationErrorsShown}
            />
          </div>
          <div className="mb-6">
            <FormInput
              type="date"
              name="username"
              formValues={loginDetails}
              placeholder="End Date"
              onChange={({target: {name, value}}) => handleFormChange(name, value)}
              formErrors={formErrors}
              showErrors={isValidationErrorsShown}
            />
          </div>
          <div className="mb-6">
            <FormInput
              type="text"
              name="username"
              formValues={loginDetails}
              placeholder="Release"
              onChange={({target: {name, value}}) => handleFormChange(name, value)}
              formErrors={formErrors}
              showErrors={isValidationErrorsShown}
            />
          </div>
        </div>

        <div className="flex justify-end space-x-4 mt-6">
          <button type="button"
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500">
            Cancel
          </button>
          <button type="submit"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500">
              Continue
            </button>
          </div>
      </form>
    </div>
  );
};

export default TaskForm;