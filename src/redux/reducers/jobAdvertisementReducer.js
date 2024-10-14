import {
    ADD_JOB_ADVERTISEMENT,
    CURRENT_USER,
    DELETE_JOB_ADVERTISEMENT,
    EDIT_JOB_ADVERTISEMENT,
    FETCH_JOB_ADVERTISEMENTS,
    FETCH_JOB_ADVERTISEMENTS_BY_RECRUITER,
    FILTER_JOB_ADVERTISEMENTS,
    FILTER_JOB_ADVERTISEMENTS_BY_RECRUITER,
    SET_LOGO_URL
} from "../actionTypes";
import {sortElementsBy} from "../../utils/utils";
import {useSelector} from "react-redux";

const initialState = {
    jobAdvertisements: [],
    jobAdvertisementsByRecruiter: []
}

let currentUser = JSON.parse(localStorage.getItem(CURRENT_USER))
export const JobAdvertisementReducer = (state = initialState, action) => {
    let jobAdvertisements;
    let jobAdvertisementsByRecruiter;
    switch (action.type) {
        case ADD_JOB_ADVERTISEMENT:

            return {
                ...state,
                jobAdvertisements: sortElementsBy([...state.jobAdvertisements, action.jobAdvertisement]),
                jobAdvertisementsByRecruiter: sortElementsBy([...state.jobAdvertisementsByRecruiter, action.jobAdvertisement], "postedOn")
            }
        case EDIT_JOB_ADVERTISEMENT:
            jobAdvertisements = state.jobAdvertisements.filter(jobAd => jobAd.id !== action.jobAdvertisement.id)
            jobAdvertisementsByRecruiter = state.jobAdvertisementsByRecruiter.filter(jobAd => jobAd.id !== action.jobAdvertisement.id)

            return {
                jobAdvertisements: sortElementsBy([...jobAdvertisements, action.jobAdvertisement], "postedOn"),
                jobAdvertisementsByRecruiter: sortElementsBy([...jobAdvertisementsByRecruiter, action.jobAdvertisement], "postedOn")
            }
        case DELETE_JOB_ADVERTISEMENT:
            jobAdvertisements = state.jobAdvertisements.filter(jobAd => jobAd.id !== action.id)
            jobAdvertisementsByRecruiter = state.jobAdvertisementsByRecruiter.filter(jobAd => jobAd.id !== action.id)

            return {
                jobAdvertisements: sortElementsBy([...jobAdvertisements], "postedOn"),
                jobAdvertisementsByRecruiter: sortElementsBy([...jobAdvertisementsByRecruiter], "postedOn")
            }

        case FETCH_JOB_ADVERTISEMENTS:
            return {
                ...state,
                jobAdvertisements: sortElementsBy(action.jobAdvertisements, "postedOn")
            }


        case FETCH_JOB_ADVERTISEMENTS_BY_RECRUITER:
            return {
                ...state,
                jobAdvertisementsByRecruiter: sortElementsBy(action.jobAdvertisementsByRecruiter, "postedOn")
            }

        default:
            return {
                ...state,
            };
    }
}

export default JobAdvertisementReducer