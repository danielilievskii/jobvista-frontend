import axios from "../../axios/axiosInstance";
import {SET_PROFILE_PIC_URL} from "../actionTypes";

export const JobSeekerActions = {

    submitProfilePic: (formData, callback) => {
        let jobSeekerId = formData.get("jobSeekerId");
        let profilePicFile =  formData.get("profilePicFile")
        return dispatch => {
            axios.post("/job-seeker/submit-profile-pic", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
                .then(response => {
                    const blob = new Blob([profilePicFile])
                    const profilePicUrl = window.URL.createObjectURL(blob);
                    dispatch({
                        type: SET_PROFILE_PIC_URL,
                        payload: {jobSeekerId, profilePicUrl}
                    })
                    callback(true, response)
                }).catch(error => {
                    callback(false, error)
            })
        }
    },

    downloadProfilePic: (jobSeekerId, callback) => {
        return dispatch => {
            return axios.get("/job-seeker/" + jobSeekerId + "/download-profile-pic", {responseType: "blob"})
                .then(response => {
                    const blob = new Blob([response.data])
                    const profilePicUrl = window.URL.createObjectURL(blob);
                    dispatch({
                        type: SET_PROFILE_PIC_URL,
                        payload: {jobSeekerId, profilePicUrl}
                    });
                    callback(true, profilePicUrl)
                }).catch(error => {
                    callback(false, error)
                })
        }
    },

    fetchJobSeekerEditDetailsById: (id, callback) => {
        return dispatch => {
            return axios.get("/job-seeker/"+id+"/edit-info")
                .then(response => {
                    callback(true, response)
                }).catch(error => {
                    callback(false, error)
                })
        }
    },

    editJobSeekerDetailsById: (data, id, callback) => {
        return dispatch => {
            return axios.post("/job-seeker/"+id+"/edit-info", data)
                .then(response => {
                    callback(true, response)
                }).catch(error => {
                    callback(false, error)
                })
        }
    }
}