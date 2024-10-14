import axios from "../../axios/axiosInstance";
import {
    ADD_JOB_ADVERTISEMENT,
    CURRENT_USER, DELETE_JOB_ADVERTISEMENT, EDIT_JOB_ADVERTISEMENT,
    FETCH_JOB_ADVERTISEMENTS,
    FETCH_JOB_ADVERTISEMENTS_BY_RECRUITER, FILTER_JOB_ADVERTISEMENTS
} from "../actionTypes";

export const JobAdvertisementActions = {
    addJobAdvertisement: (jobAdvertisement, callback) => {
        return dispatch => {
            axios.post("/job-advertisements/add", jobAdvertisement)
                .then(response => {
                    dispatch({
                        type: ADD_JOB_ADVERTISEMENT,
                        jobAdvertisement: response.data
                    })
                    callback(true)
                }).catch((error) => {
                console.error(error)
                callback(false)
            })
        }
    },
    editJobAdvertisement: (jobAdvertisement, id, callback) => {
        return dispatch => {
            axios.put("/job-advertisements/edit/" + id, jobAdvertisement)
                .then(response => {
                    dispatch({
                        type: EDIT_JOB_ADVERTISEMENT,
                        jobAdvertisement: response.data
                    })
                    callback(true)
                }).catch((error) => {
                console.error(error)
                callback(false)
            })
        }
    },
    deleteJobAdvertisement: (id, callback) => {
        return dispatch => {
            axios.delete("/job-advertisements/delete/" + id)
                .then(response => {
                    dispatch({
                        type: DELETE_JOB_ADVERTISEMENT,
                        id: id
                    })
                    callback(true)
                }).catch(error => {
                console.error(error)
                callback(false)
            })

        }
    },
    fetchJobAdvertisementById: (id, callback) => {
        axios.get("/job-advertisements/" + id)
            .then(response => {
                callback(true, response)
            }).catch(error => {
            callback(false, error)
        })
    },

    fetchJobAdvertisements: (callback) => {
        return dispatch => {
            axios.get("/job-advertisements/all")
                .then(response => {
                    dispatch({
                        type: FETCH_JOB_ADVERTISEMENTS,
                        jobAdvertisements: response.data,
                    })
                    callback(true, response)
                }).catch((error) => {
                callback(false, error)
            })
        }
    },
    filterJobAdvertisements: (filter, callback) => {
        axios.post("/job-advertisements/filtered", filter)
            .then(response => {
                callback(true, response)
            }).catch((error) => {
            callback(false, error)
        })

    },

    fetchJobAdvertisementsByRecruiter: (recruiterId, callback) => {
        return dispatch => {
            let currentUser = JSON.parse(localStorage.getItem(CURRENT_USER));
            axios.get("/job-advertisements/recruiter/" + recruiterId)
                .then(response => {
                    dispatch({
                        type: FETCH_JOB_ADVERTISEMENTS_BY_RECRUITER,
                        jobAdvertisementsByRecruiter: response.data,
                    })
                    callback(true, response)
                }).catch((error) => {
                callback(false, error)
            })
        }
    },

    fetchJobAdvertisementsByRecruiterProfile: (recruiterId, callback) => {
        return dispatch => {
            let currentUser = JSON.parse(localStorage.getItem(CURRENT_USER));
            axios.get("/job-advertisements/recruiter/" + recruiterId)
                .then(response => {
                    callback(true, response)
                }).catch((error) => {
                callback(false, error)
            })
        }
    },

    filterJobAdvertisementsByRecruiter: (id, filter, callback) => {

        let currentUser = JSON.parse(localStorage.getItem(CURRENT_USER));
        axios.post("/job-advertisements/recruiter/" + id + "/filtered", filter)
            .then(response => {
                callback(true, response)
            }).catch((error) => {
            callback(false, error)
        })

    },

    fetchRecruiterDetailsById: (id, callback) => {
        axios.get("/recruiter/" + id + "/info")
            .then(response => {
                callback(true, response)
            }).catch(error => {
            callback(false, error)
        })
    }
}