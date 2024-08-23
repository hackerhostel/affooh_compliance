import MainPageLayout from '../../layouts/MainPageLayout.jsx'
import ReleaseListPage from "./ReleaseListPage.jsx";
import ReleaseContentPage from "./ReleaseContentPage.jsx";

const ReleaseLayout = () => {
    return (
        <MainPageLayout
            title="Releases"
            leftColumn={<ReleaseListPage/>}
            rightColumn={<ReleaseContentPage/>}
            subText={"Add New"}
        />
    );
}

export default ReleaseLayout;