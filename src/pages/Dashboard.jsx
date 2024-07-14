import ExampleListPage from "./example-page/ExampleListPage.jsx";
import {Route, Switch} from "react-router-dom";
import Sidebar from "../components/navigation/Sidebar.jsx";
import Header from "../components/navigation/Header.jsx";
import ExampleLayout from "./example-page/index.jsx";

const Dashboard = () => {
  return (
    <>
      <Header/>
      <div className="h-screen bg-white overflow-hidden flex">
        <Sidebar/>

        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <Switch>
            <Route path="/dashboard">
              <ExampleLayout/>
            </Route>

            <Route path="/profile">
              <div>profile</div>
            </Route>

            <Route path="/notifications">
              <div>notifications</div>
            </Route>

            <Route path="/settings">
              <div>settings</div>
            </Route>
          </Switch>
        </main>
      </div>
    </>
  )
}

export default Dashboard;