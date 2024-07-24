import MainPageLayout from '../../layouts/MainPageLayout.jsx'
import ReleasesPage from "./ReleasesPage.jsx";
import ReleaseContentPage from "./ReleaseContentPage.jsx";

const ReleaseLayout = () => {
    return (
        <MainPageLayout
            title="Releases"
            leftColumn={<ReleasesPage/>}
            rightColumn={<ReleaseContentPage/>}
        />
    );
}

export default ReleaseLayout;