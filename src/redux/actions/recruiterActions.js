
import axios from "../../axios/axiosInstance";
import {SET_LOGO_URL} from "../actionTypes";
export const RecruiterActions =  {
    submitLogo: (formData, callback) => {
        let recruiterId = formData.get("recruiterId");
        let logoFile =  formData.get("logoFile")
        return dispatch => {
            axios.post("/recruiter/submit-logo", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
                .then(response => {
                    const blob = new Blob([logoFile])
                    const logoUrl = window.URL.createObjectURL(blob);
                    dispatch({
                        type: SET_LOGO_URL,
                        payload: { recruiterId, logoUrl }
                    });
                    callback(true, response)
                }).catch(error => {
                    callback(false, error)
            })
        }
    },

    downloadLogo: (recruiterId, callback) => {
        return dispatch => {
            return axios.get("/recruiter/" + recruiterId + "/download-logo", {responseType: "blob"})
                .then(response => {
                    const blob = new Blob([response.data])
                    const logoUrl = window.URL.createObjectURL(blob);
                    dispatch({
                        type: SET_LOGO_URL,
                        payload: { recruiterId, logoUrl }
                    });
                    callback(true, logoUrl);
                }).catch(error => {
                    callback(false, error)
                })
        }
    },

    fetchRecruiterEditDetailsById: (id, callback) => {
        return dispatch => {
            return axios.get("/recruiter/"+id+"/edit-info")
                .then(response => {
                    callback(true, response)
                }).catch(error => {
                    callback(false, error)
                })
        }
    },

    editRecruiterDetailsById: (data, id, callback) => {
        return dispatch => {
            return axios.post("/recruiter/"+id+"/edit-info", data)
                .then(response => {
                    callback(true, response)
                }).catch(error => {
                    callback(false, error)
                })
        }
    }
}
