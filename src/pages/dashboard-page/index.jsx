import MainPageLayout from "../../layouts/MainPageLayout";
import DashboardListPage from "../dashboard-page/dashboardListPage";
import DashboardContentPage from "../dashboard-page/dashboardContentPage";

const DashboardLayout = () => {

    <MainPageLayout
    title = "Dashboard"
    leftColumn={<DashboardListPage/>}
    rightColumn={<DashboardContentPage/>}
    />
}

export default DashboardLayout;