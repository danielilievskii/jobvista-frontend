import {CHANGE_ACCESS, FETCH_RECRUITERS} from "../actionTypes";
import {sortElementsBy} from "../../utils/utils";

const initialState = {
    recruiters: [],
}

const AdminReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_RECRUITERS:
            return {
                ...state,
                recruiters: sortElementsBy(action.recruiters, "registeredOn")
            }
        case CHANGE_ACCESS:
            return {
                ...state,
                recruiters: state.recruiters.map(recruiter =>
                recruiter.id === action.recruiter.id ?
                    {...recruiter, hasAccess: action.recruiter.hasAccess} :
                    recruiter
                )
            }
        default:
            return {
                ...state,
            };
    }
}

export default AdminReducer