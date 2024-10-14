import { createSlice } from '@reduxjs/toolkit';
import { AUTH_TOKEN } from "../../axios/axiosInstance";
import {isExpired} from "react-jwt";
import {CURRENT_USER, SIGN_IN, SIGN_OUT, UPDATE_TOKEN} from "../actionTypes";
import {jwtDecode} from "jwt-decode";

const initialState = {
    currentUser: "",
    token: ""
};

const AuthReducer = (state = initialState, action) => {
    switch (action.type) {
        case SIGN_IN:
            localStorage.setItem(AUTH_TOKEN, action.payload.token);
            //localStorage.setItem(CURRENT_USER, JSON.stringify(action.payload.user));
            return {
                ...state,
                currentUser: action.payload.user,
                token: action.payload.token
            };
        case UPDATE_TOKEN:
            let token = action.payload;
            let decodedToken;
            let currentUser = "";
            if(token !=null) {
                try {
                    decodedToken = jwtDecode(token);
                } catch (error) {
                    console.log("Failed to decode token: " + error)
                }
            }

            if(!isExpired(token)) {
                localStorage.setItem(AUTH_TOKEN, token);
                currentUser = {
                    name: decodedToken.name,
                    role: decodedToken.role,
                    access: decodedToken.access,
                    id: decodedToken.id
                };
            } else {
                //localStorage.removeItem(CURRENT_USER);
                localStorage.removeItem(AUTH_TOKEN);
                currentUser = "";
                token = "";
            }
            return {
                ...state,
                currentUser: currentUser,
                token: token
            };
        case SIGN_OUT:
            //localStorage.removeItem(CURRENT_USER);
            localStorage.removeItem(AUTH_TOKEN);
            return {
                ...state,
                currentUser: "",
                token: "",
            }

        default:
            return {
                ...state,
            };
    }
}
export default AuthReducer

//naredna prilika :(
// const authSlice = createSlice({
//     name: 'auth',
//     initialState,
//     reducers: {
//         signIn: (state, action) => {
//             console.log("stigam tuka")
//             const { token, user } = action.payload;
//             localStorage.setItem(AUTH_TOKEN, token);
//             localStorage.setItem("CURRENT_USER", JSON.stringify(user));
//             state.currentUser = user;
//             state.token = token;
//         },
//     }
// });
//
// //export const { signIn, signOut } = authSlice.actions;
// export default authSlice.reducer;