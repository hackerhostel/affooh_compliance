import MainPageLayout from '../../layouts/MainPageLayout.jsx'
import TestPlanListPage from "./TestPlanListPage.jsx";
import TestPlanContentPage from "./TestPlanContentPage.jsx";

const TestPlanLayout = () => {
    return (
        <MainPageLayout
            title="Test Plans"
            leftColumn={<TestPlanListPage/>}
            rightColumn={<TestPlanContentPage/>}
            subText={"Add New"}
        />
    );
}

export default TestPlanLayout;