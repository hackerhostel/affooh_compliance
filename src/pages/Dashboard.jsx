import ProjectListPage from "./project-page/ProjectListPage.jsx";
import {Route, Switch} from "react-router-dom";
import Sidebar from "../components/navigation/Sidebar.jsx";
import Header from "../components/navigation/Header.jsx";
import ProjectLayout from "./project-page/index.jsx";
import UserLayout from "./user-page/index.jsx";
import UnderConstruction from "../components/UnderConstruction.jsx";

const Dashboard = () => {
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