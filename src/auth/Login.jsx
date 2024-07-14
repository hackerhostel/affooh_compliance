import React, {useRef, useState} from 'react';
import { signIn } from 'aws-amplify/auth'
import useValidation from "../utils/use-validation.jsx";
import FormInput from "../components/FormInput.jsx";
import {LoginSchema} from "../state/domains/authModels.js";
import {useToasts} from "react-toast-notifications";
import {useHistory} from "react-router-dom";
import {doGetCurrentUser} from "../state/slice/authSlice.js";
import {useDispatch} from "react-redux";

const Login = () => {
  const { addToast } = useToasts();
  const dispatch = useDispatch();

  const history = useHistory();
  const [loginDetails, setLoginDetails] = useState({ username: '', password: '' });

  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isValidationErrorsShown, setIsValidationErrorsShown] = useState(false);
  const formRef = useRef(null);
  const [formErrors] = useValidation(LoginSchema, loginDetails);

  const handleFormChange = (name, value) => {
    const newForm = { ...loginDetails, [name]: value };
    setLoginDetails(newForm);
  };

  const login = async (event) => {

    event.preventDefault();
    if (formErrors) {
      setIsValidationErrorsShown(true);
      return;
    }

    if (loading) {
      return;
    }

    setLoading(true);
    setIsValidationErrorsShown(false);

    try {
      const response = await signIn(loginDetails)

      dispatch(doGetCurrentUser())
      // TODO: handle challenges like NEW_PASSWORD_REQUIRED
      addToast('logged in Successfully', { appearance: 'success', autoDismiss: true });
      formRef.current.reset();
      history.push('/dashboard');
    } catch (e) {
      addToast(e.message, { appearance: 'error' });
    }
  }

    return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-400">
      <div className="bg-white rounded-lg shadow-lg p-8 w-96">
        <h4 className="text-2xl font-bold mb-8">Login</h4>
        <form className="space-y-6" ref={formRef} onSubmit={login}>
          <div className="mb-6">
            <FormInput
              type="text"
              name="username"
              formValues={loginDetails}
              placeholder="Username"
              onChange={({ target: { name, value } }) => handleFormChange(name, value)}
              formErrors={formErrors}
              showErrors={isValidationErrorsShown}
            />
          </div>
          <div className="mb-6">
            <FormInput
              type="password"
              name="password"
              formValues={loginDetails}
              placeholder="Password"
              onChange={({ target: { name, value } }) => handleFormChange(name, value)}
              formErrors={formErrors}
              showErrors={isValidationErrorsShown}
            />
          </div>
          <input
            type="submit"
            value="LOGIN"
            className="w-full py-3 rounded-lg bg-purple-500 text-white font-bold hover:bg-purple-700 cursor-pointer"
          />
        </form>
        <a className="block text-blue-700 mt-6 text-center" href="/signup">Sign Up</a>
      </div>
    </div>
  )
}

export default Login;
