import {useSelector} from "react-redux";
import {selectSelectedProject} from "../../state/slice/projectSlice.js";

const ExampleContentPage = () => {
  const selectedProject = useSelector(selectSelectedProject);

  return (
   <>
     {!selectedProject ? (
       <div className="bg-gray-50 p-4 text-center h-screen">No Details {selectedProject}</div>
     ): (
       <div className="bg-gray-50 p-4 text-center h-screen">selected id: {selectedProject}</div>
     )
     }
   </>
  )
}

export default ExampleContentPage;