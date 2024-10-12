import {useSelector} from "react-redux";
import {selectSelectedProjectFromList} from "../../state/slice/projectSlice.js";
import ReleaseEdit from "./ReleaseEdit.jsx";

const ReleaseContentPage = () => {
  const selectedProject = useSelector(selectSelectedProjectFromList);

  return (
   <>
     {!selectedProject ? (
       <div className="p-4 text-center"><ReleaseEdit releaseId={0} /></div>
     ): (
       <div className="p-4 text-center">selected id: {selectedProject?.id}</div>
     )
     }
   </>
  )
}

export default ReleaseContentPage;