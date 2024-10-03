import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { selectSelectedProject } from "../../state/slice/projectSlice.js";
import FormInput from "../../components/FormInput.jsx";
import { EllipsisVerticalIcon } from '@heroicons/react/24/outline';

const ProjectContentPage = () => {
  const selectedProject = useSelector(selectSelectedProject);
  const [activeButton, setActiveButton] = useState("Details"); 
  const [formValues, setFormValues] = useState({ name: "", key: "", type: "", createdBy: "" });

  
  useEffect(() => {
    console.log("Selected project updated:", selectedProject);
  }, [selectedProject]);

  
  const handleButtonClick = (buttonName) => {
    setActiveButton(buttonName);
  };

  // Handle form input changes
  const handleFormChange = (name, value) => {
    setFormValues({ ...formValues, [name]: value });
  };

  const [issueFormValues, setIssueFormValues] = useState({
    issueType: "",
    priority: "",
    severity: "",
    status: ""
  });


  const handleIssueFormChange = (name, value) => {
    setIssueFormValues({
      ...issueFormValues,
      [name]: value
    });
  };


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
