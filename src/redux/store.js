import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import authReducer from "./reducers/authReducer";
import jobAdReducer from "./reducers/jobAdvertisementReducer";
import applicationReducer from "./reducers/applicationReducer"
import adminReducer from "./reducers/adminReducer"
import {AdminActions} from "./actions/adminActions";
import ImagesReducer from "./reducers/imagesReducer";

// const rootReducer = combineReducers({
//     auth: AuthReducer
// });
//
// export const store = configureStore({
//     reducer: rootReducer,
//     //middleware: thunk
// });

export const store = configureStore({
    reducer: {
        auth: authReducer,
        jobAd: jobAdReducer,
        appl: applicationReducer,
        admin: adminReducer,
        images: ImagesReducer
    },
});

//export default store;