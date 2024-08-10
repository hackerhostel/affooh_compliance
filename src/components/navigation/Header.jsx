import {useCallback} from "react";
import FormSelect from "../FormSelect.jsx";
import {useDispatch, useSelector} from "react-redux";
import {doSwitchProject, selectProjectList, selectSelectedProject} from "../../state/slice/projectSlice.js";

const Header = () => {
  const dispatch = useDispatch();
  const selectedProject = useSelector(selectSelectedProject);
  const projectList = useSelector(selectProjectList);

  const handleChange = (e, value) => {
    console.log(value)
    dispatch(doSwitchProject(value));
    // TODO: need to handle selected project change for the app
  };

  const getProjectOptions = useCallback(() => {
    return projectList.map(project => ({
      value: project.id,
      label: project.name
    }));
  }, [projectList]);

  return (
    <div className="flex justify-between w-full">
      <div className="py-5 px-4 w-96">
        <FormSelect
          name="project"
          showLabel={false}
          formValues={{project: selectedProject?.id}}
          placeholder="Select a project"
          options={getProjectOptions()}
          onChange={handleChange}
        />
      </div>
    </div>
  )
}

export default Header