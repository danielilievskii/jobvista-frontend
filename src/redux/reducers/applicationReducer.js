import {
    CURRENT_USER,
    FETCH_APPLICATIONS_BY_JOB_ID,
    FETCH_APPLICATIONS_BY_JOB_SEEKER_ID, FILTER_APPLICATIONS_BY_JOB_ID, FILTER_APPLICATIONS_BY_JOB_SEEKER_ID,
    SUBMIT_APPLICATION, UPDATE_APPLICATION, UPDATE_APPLICATION_STATUS
} from "../actionTypes";

const initialState = {
    applicationsByJobSeeker: [],
    applicationsByJobAdId: []
}

let currentUser = JSON.parse(localStorage.getItem(CURRENT_USER))

export const ApplicationReducer = (state = initialState, action) => {
    let applications;

    switch (action.type) {
        case SUBMIT_APPLICATION:
            return {
                ...state,
                applicationsByJobSeeker: [...state.applicationsByJobSeeker, action.application]
            }
        case UPDATE_APPLICATION:
            return {
                ...state,
                applicationsByJobSeeker: state.applicationsByJobSeeker.map(application =>
                    application.id === action.application.id ?
                        action.application : // Replace with the updated application
                        application // Keep the old one
                )
            }
        case UPDATE_APPLICATION_STATUS:
            return {
                ...state,
                applicationsByJobAdId: state.applicationsByJobAdId.map(application =>
                application.id === action.application.id ?
                    {...application, status: action.application.status} :
                    application
                )
            }
        case FETCH_APPLICATIONS_BY_JOB_ID:
            return {
                ...state,
                applicationsByJobAdId: action.applicationsByJobAdId
            }
        case FILTER_APPLICATIONS_BY_JOB_ID:
            return {
                ...state,
                applicationsByJobAdId: action.applicationsByJobAdId
            }

        case FETCH_APPLICATIONS_BY_JOB_SEEKER_ID:
            return {
                ...state,
                applicationsByJobSeeker: action.applicationsByJobSeeker
            }
        case FILTER_APPLICATIONS_BY_JOB_SEEKER_ID:
            return {
                ...state,
                applicationsByJobSeeker: action.applicationsByJobSeeker
            }
        default:
            return {
                ...state,
            };
    }
}

export default ApplicationReducer