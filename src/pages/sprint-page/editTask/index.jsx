import MainPageLayout from '../../../layouts/MainPageLayout.jsx'
import GapAnalysisListPage from '../GapAnalysisListPage.jsx'
import EditTaskContent from '../../../components/task/edit/EditTask.jsx'

const EditTaskLayout = () => {
    return (
        <MainPageLayout
            title="Sprint"
            leftColumn={<GapAnalysisListPage/>}
            rightColumn={<EditTaskContent/>}
        />
    );
}

export default EditTaskLayout;