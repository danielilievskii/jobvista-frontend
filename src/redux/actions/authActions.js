import axios from "../../axios/axiosInstance";
import {SIGN_IN, SIGN_OUT, UPDATE_TOKEN} from "../actionTypes";

export const AuthActions = {
    signUpJobSeeker: (firstName, lastName, phoneNumber, email, password, callback) => {
        return dispatch => {
            axios.post("/auth/signup/job-seeker", {
                email,
                password,
                firstName,
                lastName,
                phoneNumber
            }).then(response => {
                dispatch(AuthActions.signIn(email, password));
                callback(true, response);
            }).catch((error) => {
                callback(false, error);
            });
        };
    },
    signUpRecruiter: (companyName, phoneNumber, email, password, callback) => {
        return dispatch => {
            axios.post("/auth/signup/recruiter", {
                email,
                password,
                companyName,
                companyDescription: "",
                phoneNumber
            }).then(response => {
                dispatch(AuthActions.signIn(email, password));
                callback(true, response);
            }).catch((error) => {
                callback(false, error);
            });
        };
    },

    signInGoogle: (tokenId, callback) => {
        return dispatch => {
            axios.post("/auth/google", { tokenId })
                .then(jwtResponse => {
                    const response = jwtResponse.data;
                    const token = response.token;
                    const user = {
                        name: response.name,
                        role: response.role,
                        access: response.hasAccess,
                        id: response.id,
                    };
                    dispatch({
                        type: SIGN_IN,
                        payload: {
                            token,
                            user
                        }
                    });
                    callback && callback(true);
                }).catch(error => {
                callback && callback(false, error);
            });
        };
    },

    signIn: (email, password, callback) => {
        return dispatch => {
            axios.post("/auth/signin", {
                email, password
            }).then(jwtResponse => {
                const response = jwtResponse.data;
                const token = response.token;
                //const refreshToken = response.refreshToken;
                const user = {
                    name: response.name,
                    role: response.role,
                    access: response.hasAccess,
                    id: response.id,
                };
                dispatch({
                    type: SIGN_IN,
                    payload: {
                        token,
                        //refreshToken,
                        user
                    }
                });
                callback && callback(true);
            }).catch((error) => {
                callback && callback(false, error);
            });
        };
    },
    signOut: () => {
        return dispatch => {
            dispatch({
                type: SIGN_OUT
            });
        }
    },
    updateToken: (token) => {
        return dispatch => {
            dispatch({
                type: UPDATE_TOKEN,
                payload: token
            });
        }
    }
};

