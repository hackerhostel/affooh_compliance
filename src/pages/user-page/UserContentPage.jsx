import {useSelector} from "react-redux";
import {selectSelectedProject} from "../../state/slice/projectSlice.js";

const UserContentPage = () => {
  const selectedProject = useSelector(selectSelectedProject);

  return (
   <>
     {!selectedProject ? (
       <div className="p-4 text-center">No Details {selectedProject}</div>
     ): (
       <div className="p-4 text-center">selected id: {selectedProject}</div>
     )
     }
   </>
  )
}

export default UserContentPage;