import MainPageLayout from '../../layouts/MainPageLayout.jsx'
import TestSuiteContentPage from "./TestSuiteContentPage.jsx";
import TestSuiteListPage from "./TestSuiteListPage.jsx";

const TestSuiteLayout = () => {
    return (
        <MainPageLayout
            title="Test Suites"
            leftColumn={<TestSuiteListPage/>}
            rightColumn={<TestSuiteContentPage/>}
            subText={"Add New"}
        />
    );
}

export default TestSuiteLayout;