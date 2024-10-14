import {SET_LOGO_URL, SET_PROFILE_PIC_URL} from "../actionTypes";

const initialState = {
    profilePictures: {},
    logos: {}
}

const ImagesReducer = (state = initialState, action) => {

    switch (action.type) {
        case SET_PROFILE_PIC_URL:
            return{
                ...state,
                profilePictures: {
                   ...state.profilePictures, [action.payload.jobSeekerId]: action.payload.profilePicUrl
                }
            }
        case SET_LOGO_URL:
            return {
                ...state,
                logos: {
                    ...state.logos, [action.payload.recruiterId]: action.payload.logoUrl
                }
            }
        default:
            return {
                ...state,
            };
    }
}

export default ImagesReducer