import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import {Amplify} from "aws-amplify";
import {AwsConfigAuth} from "./auth/auth.js";
import {Provider} from "react-redux";
import {store} from './state'
import {ToastProvider} from "react-toast-notifications";


import 'devextreme/dist/css/dx.material.blue.light.css';
import {getBuildConstant} from "./constants/build-constants.jsx";

axios.defaults.baseURL = getAPIBaseURL();
axios.defaults.headers.common['x-api-key'] = getBuildConstant('REACT_APP_X_API_KEY');

Amplify.configure(AwsConfigAuth);


ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <React.StrictMode>
      <ToastProvider autoDismiss={true} placement={"bottom-left"}>
        <App/>
      </ToastProvider>
    </React.StrictMode>
  </Provider>,
)
