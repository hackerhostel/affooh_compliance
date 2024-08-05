import {useState} from 'react'
import './App.css'
import { Switch, Route, BrowserRouter } from 'react-router-dom';
import ProjectListPage from "./pages/project-page/ProjectListPage.jsx";
import Login from "./auth/Login.jsx";
import Register from './auth/Register.jsx'
import ForgotPassword from './auth/ForgotPassword.jsx'
import PublicGuard from "./auth/PublicGuard.jsx";
import AuthGuard from "./auth/AuthGuard.jsx";
import Dashboard from "./pages/Dashboard.jsx";

function App() {
  const [count, setCount] = useState(0)

  return (
      <BrowserRouter>
        <Switch>
          <Route path="/login">
            <PublicGuard>
              <Login />
            </PublicGuard>
          </Route>

          <Route path="/register">
            <PublicGuard>
              <Register />
            </PublicGuard>
          </Route>

          <Route path="/forgot-password">
            <PublicGuard>
              {/*TODO: need to implement*/}
              <ForgotPassword />
            </PublicGuard>
          </Route>

          <Route path="/forgot-password-reset">
            <PublicGuard>
              {/*TODO: need to implement*/}
              {/*<ForgotPasswordReset />*/}
            </PublicGuard>
          </Route>

          <AuthGuard>
            <Dashboard />
          </AuthGuard>
        </Switch>
      </BrowserRouter>
  )
}

export default App
