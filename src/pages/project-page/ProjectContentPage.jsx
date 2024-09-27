import { useSelector } from "react-redux";
import { selectSelectedProjectFromList } from "../../state/slice/projectSlice.js";

const ProjectContentPage = () => {
  const selectedProject = useSelector(selectSelectedProjectFromList);

  // Console log to check the selected project's name
  console.log("Selected Project Name:", selectedProject);

  return (
    <>
      {!selectedProject ? (
        <div className="p-4 text-center">No Details</div>
      ) : (
        <div className="p-4 text-center">
          Selected Project Name: {selectedProject}
        </div>
      )}
    </>
  );
};

export default ProjectContentPage;
