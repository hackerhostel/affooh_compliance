import {Route, Switch} from "react-router-dom";
import Sidebar from "../components/navigation/Sidebar.jsx";
import Header from "../components/navigation/Header.jsx";
import ProjectLayout from "./project-page/index.jsx";
import UserLayout from "./user-page/index.jsx";
import UnderConstruction from "../components/UnderConstruction.jsx";
import {useDispatch, useSelector} from "react-redux";
import {
  doGetProjectBreakdown,
  selectIsProjectDetailsError,
  selectIsProjectDetailsLoading,
} from "../state/slice/projectSlice.js";
import SkeletonLoader from "../components/SkeletonLoader.jsx";
import React, {useEffect} from "react";
import {doGetCurrentUser, selectUser} from "../state/slice/authSlice.js";
import LoadingPage from "./LoadingPage.jsx";
import ServiceDownPage from "./ServiceDownPage.jsx";

const Dashboard = () => {
  const isProjectDetailsError = useSelector(selectIsProjectDetailsError);
  const isProjectDetailsLoading = useSelector(selectIsProjectDetailsLoading);
  const dispatch = useDispatch();

  // TODO: need a api to get user details with permissions and selected project, organization and project list(id and name only)
  useEffect(() => {
    dispatch(doGetCurrentUser())
    dispatch(doGetProjectBreakdown())
  }, []);

  if (isProjectDetailsLoading) return <LoadingPage />;
  if (isProjectDetailsError) return <ServiceDownPage />;

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

            <Route path="/notifications">
              <UnderConstruction />
            </Route>

            <Route path="/settings">
              <UnderConstruction />
            </Route>
          </Switch>
        </main>
      </div>
    </div>
  )
}

export default Dashboard;