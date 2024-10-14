import logo from './logo.svg';
import './App.css';
import {useDispatch, useSelector} from "react-redux";
import {BrowserRouter} from "react-router-dom";
import {Header} from "./views/static/Header";
import RoutesConfig from "./auth/RoutesConfig";
import React, {useEffect, useState} from "react";
import {AuthActions} from "./redux/actions/authActions";
import {AUTH_TOKEN} from "./axios/axiosInstance";
import {jwtDecode} from "jwt-decode";
import {NoAccess} from "./views/static/NoAccess";
import {Loading} from "./views/static/Loading";
import {ToastContainer} from "react-toastify";

function App() {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(AuthActions.updateToken(localStorage.getItem(AUTH_TOKEN)))
    }, [dispatch])

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [minimumLoadingTime, setMinimumLoadingTime] = useState(true);

    const auth = useSelector(state => state.auth);

    useEffect(() => {
        // Simulate a minimum loading time of 1 second
        const timer = setTimeout(() => {
            setMinimumLoadingTime(false);
        }, 1000);

        // Clear timeout if component unmounts
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        const token = localStorage.getItem(AUTH_TOKEN);
        if (token !== null) {
            try {
                const decodedToken = jwtDecode(token);
                setUser({
                    name: decodedToken.name,
                    role: decodedToken.role,
                    hasAccess: decodedToken.access,
                    id: decodedToken.id
                });
                setLoading(false);
            } catch (error) {
                console.error('Failed to decode token', error);
                setLoading(false);
            }
        } else {
            setLoading(false);
        }
    }, [auth]);

    if (loading || minimumLoadingTime) {
        return <Loading />; // Replace LoadingSpinner with your loading indicator component
    }

  return (
      <div className="App">
          <BrowserRouter>
              {user === null ? (
                  <>
                      <Header />
                      <RoutesConfig />
                  </>
              ) : user.hasAccess ? (
                  <>
                      <Header />
                      <RoutesConfig />
                      {/*<Loading/>*/}
                  </>
              ) : (
                  <NoAccess user={user}/>
              )}
          </BrowserRouter>
          <ToastContainer/>
      </div>
  );
}

export default App;
