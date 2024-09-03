import {Redirect, Route, Switch} from "react-router-dom";
import Sidebar from "../components/navigation/Sidebar.jsx";
import Header from "../components/navigation/Header.jsx";
import ProjectLayout from "./project-page/index.jsx";
import UserLayout from "./user-page/index.jsx";
import UnderConstruction from "../components/UnderConstruction.jsx";
import {useDispatch, useSelector} from "react-redux";
import React, {useEffect} from "react";
import {doGetWhoAmI, selectInitialDataError, selectInitialDataLoading} from "../state/slice/authSlice.js";
import LoadingPage from "./LoadingPage.jsx";
import ServiceDownPage from "./ServiceDownPage.jsx";
import TestPlanLayout from "./test-plan-page/index.jsx";
import ReleaseLayout from "./release-page/index.jsx";
import SprintLayout from "./sprint-page/index.jsx";
import SettingLayout from "./setting-page/index.jsx";
import {doGetProjectBreakdown, selectSelectedProject} from "../state/slice/projectSlice.js";
import {isNotEmptyObj} from "../utils/commonUtils.js";
import TestSuiteLayout from "./test-suite-page/index.jsx";

const Dashboard = () => {
  const isInitialDataError = useSelector(selectInitialDataError);
  const isInitialDataLoading = useSelector(selectInitialDataLoading);
  const selectedProject = useSelector(selectSelectedProject);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(doGetWhoAmI())
  }, []);

  useEffect(() => {
    if(isNotEmptyObj(selectedProject)) {
      dispatch(doGetProjectBreakdown())
    }
  }, [selectedProject])

  if (isInitialDataLoading) return <LoadingPage />;
  if (isInitialDataError) return <ServiceDownPage />;

  return (
    <div  className="flex">
      <Sidebar/>
      <div className="bg-white overflow-hidden flex flex-col w-full">
        <Header/>

        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <Switch>
            <Route path="/dashboard">
              <UnderConstruction />
            </Route>

            <Route path="/projects">
              <ProjectLayout/>
            </Route>

            <Route path="/profile">
              <UserLayout />
            </Route>

            <Route path="/test-plans/:test_plan_id/test-suites/:test_suite_id">
              <TestSuiteLayout/>
            </Route>

            <Route path="/test-plans">
              <TestPlanLayout/>
            </Route>

            <Route path="/releases">
              <ReleaseLayout/>
            </Route>

            <Route path="/settings">
              <SettingLayout/>
            </Route>

            <Route path="/sprints">
              <SprintLayout />
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