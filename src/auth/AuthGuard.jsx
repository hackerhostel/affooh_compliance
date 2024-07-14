import React, {useEffect, useState} from 'react';
import {Redirect, Route, useLocation} from 'react-router-dom';
import {getCurrentUser} from "aws-amplify/auth";

const AuthGuard = ({ children, ...rest }) => {
  const pageLocation = useLocation();
  const [loading, setLoading] = React.useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const initializeCurrentAuthUser = async () => {
    try {
      const user = await getCurrentUser();
      if (user.username) {
        setIsAuthenticated(true);

      } else {
        setIsAuthenticated(false);
      }
      setLoading(false);
    } catch (error) {
      setIsAuthenticated(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    initializeCurrentAuthUser();
  }, [pageLocation]);

  const renderGuard = () => {
    if (loading) {
      return <div>Loading...</div>;
    }

    if (!isAuthenticated) {
      return (
        <Redirect
          to={{
            pathname: '/login',
          }}
        />
      );
    }

    if (isAuthenticated) {
      return <Route {...rest} render={() => children} />;
    }

    return null;
  };

  return renderGuard();
};

export default AuthGuard;
