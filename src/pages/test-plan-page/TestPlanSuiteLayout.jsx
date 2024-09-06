import MainPageLayout from '../../layouts/MainPageLayout.jsx'
import TestPlanListPage from "./TestPlanListPage.jsx";
import TestPlanCreateComponent from "./TestPlanCreateComponent.jsx";
import {useState} from "react";
import TestSuiteContentPage from "./TestSuiteContentPage.jsx";

const TestPlanSuiteLayout = () => {

    const [isOpen, setIsOpen] = useState(false);

    const onAddNew = () => {
        setIsOpen(true)
    }

    const handleClose = () => {
        setIsOpen(false);
    };

    return (
        <>
            <MainPageLayout
                title="Test Plans"
                leftColumn={<TestPlanListPage/>}
                rightColumn={<TestSuiteContentPage/>}
                subText={"Add New"}
            />
            <TestPlanCreateComponent onClose={handleClose} isOpen={isOpen}/>
        </>
    );
}

export default TestPlanSuiteLayout;