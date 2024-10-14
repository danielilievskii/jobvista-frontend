import axios from "../../axios/axiosInstance";
import {CHANGE_ACCESS, FETCH_RECRUITERS} from "../actionTypes";

export const AdminActions = {
    fetchRecruiters: (callback) => {
        return dispatch => {
            axios.get("/admin/recruiters")
                .then(response => {
                dispatch({
                    type: FETCH_RECRUITERS,
                    recruiters: response.data
                })
                callback(true, response)
            }).catch((error) => {
                callback(false, error)
            })
        }
    },
    changeAccess: (recruiterId, access, callback) => {
        return dispatch => {
            axios.post("/admin/change-access/" + recruiterId, access, {
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(response => {
                dispatch({
                    type: CHANGE_ACCESS,
                    recruiter: response.data
                })
                callback(true, response)
            }).catch((error) => {
                callback(false, error)
            })
        }
    }
}