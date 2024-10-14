import axios from "../../axios/axiosInstance";
import {
    CURRENT_USER,
    FETCH_APPLICATIONS_BY_JOB_ID,
    FETCH_APPLICATIONS_BY_JOB_SEEKER_ID, FILTER_APPLICATIONS_BY_JOB_ID, FILTER_APPLICATIONS_BY_JOB_SEEKER_ID,
    SUBMIT_APPLICATION, UPDATE_APPLICATION, UPDATE_APPLICATION_STATUS, UPDATE_APPLICATIONS
} from "../actionTypes";

export const ApplicationActions = {
    submitApplication: (application, callback) => {
        return dispatch => {
            axios.post("/applications/submit", application, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
                .then(response => {
                    dispatch({
                        type: SUBMIT_APPLICATION,
                        application: response.data
                    })
                    callback(true, response)
                }).catch(error => {
                callback(false, error)
                console.log(error)
            })
        }
    },

    updateApplication: (applicationId, additionalFiles, callback) => {
        console.log(additionalFiles)
        return dispatch => {
            axios.post("/applications/"+ applicationId + "/update", additionalFiles, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
                .then(response => {
                    dispatch({
                        type: UPDATE_APPLICATION,
                        application: response.data
                    })
                    callback(true, response)
                }).catch(error => {
                callback(false, error)
                console.log(error)
            })
        }
    },
    updateApplicationStatus: (id, status, callback) => {
        console.log(status)
        return dispatch => {
            axios.post("/applications/" + id + "/update", {
                id: id,
                status: status
            })
                .then(response => {
                    dispatch({
                        type: UPDATE_APPLICATION_STATUS,
                        application: response.data,
                    })
                    callback(true, response)
                }).catch(error => {
                callback(false, error)
            })
        }
    },

    updateApplications: (changes, callback) => {
        return dispatch => {
            axios.post("/applications/update", changes)
                .then(response => {
                    dispatch({
                        type: UPDATE_APPLICATIONS,
                        applications: response.data
                    })
                    callback(true, response)
                }).catch(error => {
                callback(false, error)
            })
        }
    },

    fetchApplicationsByJobSeeker: (jobSeekerId, callback) => {
        return dispatch => {
            axios.get("/my-applications/" + jobSeekerId)
                .then(response => {
                    dispatch({
                        type: FETCH_APPLICATIONS_BY_JOB_SEEKER_ID,
                        applicationsByJobSeeker: response.data
                    })
                    callback(true, response)
                }).catch(error => {
                callback(false, error)
            })
        }
    },

    filterApplicationsByJobSeeker: (jobSeekerId, status, callback) => {
        return dispatch => {
            axios.post("/my-applications/" + jobSeekerId + "/filtered", status)
                .then(response => {
                    dispatch({
                        type: FILTER_APPLICATIONS_BY_JOB_SEEKER_ID,
                        applicationsByJobSeeker: response.data
                    })
                    callback(true, response)
                }).catch(error => {
                callback(false, error)
            })
        }
    },

    fetchApplicationsByJobAdId: (jobAdId, callback) => {
        return dispatch => {
            axios.get("/job-advertisements/" + jobAdId + "/applications")
                .then(response => {
                        dispatch({
                            type: FETCH_APPLICATIONS_BY_JOB_ID,
                            applicationsByJobAdId: response.data
                        })
                        callback(true, response)
                    }
                ).catch(error => {
                callback(false, error)
            })
        }
    },

    filterApplicationsByJobAdId: (jobAdId, status, callback) => {
        return dispatch => {
            axios.post("/job-advertisements/" + jobAdId + "/applications/filtered", status)
                .then(response => {
                        dispatch({
                            type: FILTER_APPLICATIONS_BY_JOB_ID,
                            applicationsByJobAdId: response.data
                        })
                        callback(true, response)
                    }
                ).catch(error => {
                callback(false, error)
            })
        }
    },
    downloadResume: (id, callback) => {
        return axios.get("/applications/" + id + "/download-resume", {responseType: "blob"})
            .then(response => {
                const blob = new Blob([response.data], {type: 'application/pdf'});
                const url = window.URL.createObjectURL(blob);
                callback(true, url);
            })
            .catch(error => {
                callback(false, error)
            })

    },
    downloadAdditionalFiles: (id, callback) => {
        return axios.get("/applications/" + id + "/download-additional-files")
            .then(response => {
                const urls = response.data; // This will be a list of URLs
                callback(true, urls);
            })
            .catch(error => {
                callback(false, error);
            });

    }
}