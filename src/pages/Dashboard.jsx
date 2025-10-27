import {Redirect, Route, Switch} from "react-router-dom";
import Sidebar from "../components/navigation/Sidebar.jsx";
import Header from "../components/navigation/Header.jsx";
import ProjectLayout from "./project-page/index.jsx";
import UserLayout from "./user-page/index.jsx";
import UnderConstruction from "../components/UnderConstruction.jsx";
import {useDispatch, useSelector} from "react-redux";
import React, {useEffect} from "react";
import {doGetWhoAmI, selectInitialUserDataError, selectInitialUserDataLoading} from "../state/slice/authSlice.js";
import LoadingPage from "./LoadingPage.jsx";
import ServiceDownPage from "./ServiceDownPage.jsx";
import TestPlanLayout from "./test-plan-page/index.jsx";
import DashboardLayout from "./dashboard-page/index.jsx";
import ReleaseLayout from "./release-page/index.jsx";
import SprintLayout from "./sprint-page/index.jsx";
import SettingLayout from "./setting-page/index.jsx";
import OrganizationalLayout from "./organizational-page/index.jsx";
import RoleLayout from "./role-page/index.jsx";
import AssetManagementLayout from "./asset-management/index.jsx";
import ProcessFrameWorkLayout from "./process-framework/index.jsx";
import ReviewAndAuditsLayout from "./ReviewsAndAudits/index.jsx";
import ObjectivesAndKPIsLayout from "./Objectives-KPIs/index.jsx";
import TrainingPlansLayout from "./Training-plans/index.jsx";
import OperationLayout from "./Operation-management/index.jsx";
import {doGetProjectBreakdown, selectSelectedProject} from "../state/slice/projectSlice.js";
import {isNotEmptyObj} from "../utils/commonUtils.js";
import EditTaskPage from "../pages/sprint-page/editTask/index.jsx"
import {doGetMasterData, selectInitialDataError, selectInitialDataLoading} from "../state/slice/appSlice.js";

const Dashboard = () => {
  const isInitialAppDataError = useSelector(selectInitialDataError);
  const isInitialAppDataLoading = useSelector(selectInitialDataLoading);
  const isInitialUserDataError = useSelector(selectInitialUserDataError);
  const isInitialUserDataLoading = useSelector(selectInitialUserDataLoading);
  const selectedProject = useSelector(selectSelectedProject);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(doGetWhoAmI())
    dispatch(doGetMasterData())
  }, []);

  useEffect(() => {
    if(isNotEmptyObj(selectedProject)) {
      dispatch(doGetProjectBreakdown())
    }
  }, [selectedProject])

  if (isInitialUserDataLoading || isInitialAppDataLoading) return <LoadingPage />;
  if (isInitialUserDataError || isInitialAppDataError) return <ServiceDownPage />;

  return (
    <div  className="flex h-screen">
      <Sidebar/>
      <div className="bg-white overflow-hidden flex flex-col w-full">
        <Header/>

        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <Switch>
            <Route path="/dashboard">
              <DashboardLayout />
            </Route>

            <Route path="/projects">
              <ProjectLayout/>
            </Route>

            <Route path="/organizational">
              <OrganizationalLayout/>
            </Route>

            <Route path="/profile">
              <UserLayout />
            </Route>

            <Route path="/test-plans/:test_plan_id">
              <TestPlanLayout/>
            </Route>

            <Route path="/test-plans">
              <TestPlanLayout/>
            </Route>

            <Route path="/assetManagement">
              <AssetManagementLayout/>
            </Route>

             <Route path="/processFramework">
              <ProcessFrameWorkLayout/>
            </Route>

            <Route path="/reviewAndAudits">
              <ReviewAndAuditsLayout/>
            </Route>

            <Route path="/objectives">
              <ObjectivesAndKPIsLayout/>
            </Route>

            <Route path="/training">
              <TrainingPlansLayout/>
            </Route>

            <Route path="/operations">
              <OperationLayout/>
            </Route>

            <Route path="/settings">
              <SettingLayout/>
            </Route>


            <Route path="/sprints">
              <SprintLayout />
            </Route>

            <Route path="/role">
              <RoleLayout />
            </Route>

            <Route path="/sprints/:sprint_id">
              <SprintLayout />
            </Route>

            <Route path="/task/:code">
              <EditTaskPage />
            </Route>

            <Route exact path="/">
              <Redirect
                to={{
                  pathname: '/dashboard',
                }}
              />
            </Route>
          </Switch>
        </main>
      </div>
    </div>
  )
}

export default Dashboard;