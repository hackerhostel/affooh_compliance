import {useCallback} from "react";
import {Menu} from '@headlessui/react';
import FormSelect from "../FormSelect.jsx";
import {useDispatch, useSelector} from "react-redux";
import {BellIcon} from '@heroicons/react/24/outline';
import {doSwitchProject, selectProjectList, selectSelectedProject} from "../../state/slice/projectSlice.js";
import {selectUser} from "../../state/slice/authSlice.js";

const Header = () => {
  const dispatch = useDispatch();
  const selectedProject = useSelector(selectSelectedProject);
  const projectList = useSelector(selectProjectList);
  const userDetails = useSelector(selectUser);

  const handleChange = (e, value) => {
    dispatch(doSwitchProject(Number(value)));
  };

  const getProjectOptions = useCallback(() => {
    return projectList.map(project => ({
      value: project.id,
      label: project.name
    }));
  }, [projectList]);

  return (
    <div className="flex justify-between w-full">
      <div className="py-5 px-4 w-72">
        <FormSelect
          name="project"
          showLabel={false}
          formValues={{ project: selectedProject?.id }}
          placeholder="Select a project"
          options={getProjectOptions()}
          onChange={handleChange}
        />
      </div>
      <div className="flex items-center mr-4 space-x-4">
        <BellIcon className="w-8 h-8 m-3" />
        <div className="border-l border-gray-300 h-8"></div>
        <div className="flex justify-center mr-12">
          <Menu as="div" className="relative inline-block text-left">
            <Menu.Button
              className="h-16 w-16 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-pink"
            >
              {userDetails.avatar ? (
                <img
                  src={userDetails.avatar}
                  alt={`${userDetails.firstName} ${userDetails.lastName}`}
                  className="w-14 h-14 rounded-full object-cover"
                />
              ) : (
                <div
                  className="w-14 h-14 rounded-full bg-primary-pink flex items-center justify-center text-white text-xl font-semibold">
                  {userDetails.firstName?.[0]}{userDetails.lastName?.[0]}
                </div>
              )}
            </Menu.Button>
          </Menu>
        </div>
      </div>
    </div>
  );
};

export default Header;
