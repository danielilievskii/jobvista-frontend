import React, {useEffect, useState} from "react";

import "../shared_css/Modal.css"

import 'react-responsive-modal/styles.css';
import "./JobSeekerEditProfile.css"

//Validation
import * as yup from "yup";
import {yupResolver} from "@hookform/resolvers/yup";
import {Controller, useForm} from "react-hook-form";

import {useDispatch, useSelector} from "react-redux";
import {JobSeekerActions} from "../../redux/actions/JobSeekerActions";
import {notifyProfileEdit, notifyProfilePicChange} from "../../utils/toastUtils";


export const JobSeekerEditProfile = (props) => {

    const dispatch = useDispatch();
    const auth = useSelector(state => state.auth.currentUser)

    const [seekerDetails, setSeekerDetails] = useState(null);

    const [profilePicFile, setProfilePicFile] = useState(null);

    let profilePicState = useSelector(state => state.images.profilePictures);

    const [profilePicPreview, setProfilePicPreview] = useState(null);
    const [profilePicView, setProfilePicView] = useState(null);


    useEffect(() => {
        if(auth) {
            dispatch(JobSeekerActions.fetchJobSeekerEditDetailsById(auth.id, (success, response) => {
                if(success) {
                    setSeekerDetails(response.data);
                    console.log(response.data)
                }
            }))
        }
    }, [auth])

    useEffect(() => {
        if (auth.id) {
            if(!profilePicState[auth.id]) {
                dispatch(JobSeekerActions.downloadProfilePic(auth.id, (success, response) => {
                    if (success) {
                        setProfilePicView(response)
                        //setDispatched(true)
                    }
                }))
                //console.log("LOGO FETCH")
            } else {
                setProfilePicView(profilePicState[auth.id])
                //console.log("LOGO STATE")
            }

        }

    }, [auth])
    const schema = yup.object().shape({
        email: yup.string().required("Please enter your email"),
        firstName: yup.string().required("Please enter your first name"),
        lastName: yup.string().required("Please enter your last name"),
        phoneNumber: yup.string().required("Please enter your phone number"),

    })



    const {register, handleSubmit, formState: {errors}} = useForm({
        resolver: yupResolver(schema),
    });

    const editJobSeekerDetails = async (values) => {
        try {
            dispatch(JobSeekerActions.editJobSeekerDetailsById(
                {
                    email: values.email,
                    firstName: values.firstName,
                    lastName: values.lastName,
                    phoneNumber: values.phoneNumber,


                }, auth.id, (success, response) => {
                    if (success) {
                        // console.log("Recruiter details edited")
                        notifyProfileEdit()
                        setSeekerDetails(response.data)
                    }
                }
            ))
        } catch (err) {
            console.error(err)
        }
    }

    const handleButtonClick = () => {
        document.getElementById('logo-upload-input').click();
    };
    const handleLogoChange = (event) => {
        const file = event.target.files[0];
        if (file && (file.type === 'image/png' || file.type === 'image/jpeg')) {
            setProfilePicFile(file)
            setProfilePicPreview(URL.createObjectURL(file));
        }
        event.target.value = null;
    };
    const handleLogoUpload = async () => {
        try {
            const formData = new FormData();
            formData.append("jobSeekerId", auth.id);
            formData.append("profilePicFile", profilePicFile);

            dispatch(JobSeekerActions.submitProfilePic(formData, (success, response) => {
                if (success) {
                    // window.location.reload(); // MAYBE REMOVE
                    // console.log("Logo uploaded successfully")
                    notifyProfilePicChange()
                    setProfilePicPreview(null)
                    setProfilePicView(URL.createObjectURL(profilePicFile))

                }
            }))

        } catch (error) {
            console.error(error)
        }
    }

    const handleCancelUpload = () => {
        setProfilePicFile(null)
        setProfilePicPreview(null)
    }


    return (<div className="custom-container no-additional-margin">

        {profilePicPreview && (
            <div className="confirmation-bar">
                <div className="confirmation-bar-buttons">
                    <button className="cancel-changes" onClick={handleCancelUpload}>Cancel</button>
                    <button className="save-changes" onClick={handleLogoUpload}>Save changes</button>

                </div>
            </div>
        )}
        <div className="photo-box">
            <div>
                <img
                    src="/images/mountains.png"
                    className="company-banner"
                    alt="Company Banner"
                />
                {profilePicPreview ? <>
                    <img
                        src={profilePicPreview}
                        className="profile-pic"
                        alt=""
                        width={200} height={200}
                    />
                </> : <>
                    <img
                        // loading gif
                        src={profilePicView}
                        className="profile-pic"
                        alt=""
                        width={200} height={200}
                    />
                </>}

            </div>

            <div className="info-tab">
                {seekerDetails &&  <h3>{seekerDetails.firstName + " " + seekerDetails.lastName}</h3>}
                {/*<p>Active job listings: <span>{activeJobListingsCount}</span></p>*/}
            </div>

            <div className="edit-buttons">

                <input
                    type="file"
                    id="logo-upload-input"
                    accept="image/png, image/jpeg"
                    onChange={handleLogoChange}
                    style={{display: 'none'}}
                />
                <button onClick={handleButtonClick}>
                    <i className="fa-solid fa-camera"></i> Change profile picture
                </button>
                <button><i className="fa-solid fa-panorama"></i> Change cover photo</button>
            </div>

        </div>



        {seekerDetails &&
            <>
                <div className="floating-wrap">
                    <h5>Personal details</h5>
                    <form onSubmit={handleSubmit(editJobSeekerDetails)}>
                        <div className="row">
                            <div className="col-md-12">


                                <div className="form-floating mb-3">
                                    <input type="text" className="form-control" defaultValue={seekerDetails.email}  {...register("email")}
                                           placeholder="David"/>
                                    <label htmlFor="floatingFirstName">Email address</label>
                                    <p className="error-message">{errors.email?.message}</p>
                                </div>

                                <div className="form-floating mb-3">
                                    <input type="text" className="form-control" defaultValue={seekerDetails.firstName}  {...register("firstName")}
                                           placeholder="David"/>
                                    <label htmlFor="floatingFirstName">First name</label>
                                    <p className="error-message">{errors.firstName?.message}</p>
                                </div>

                                <div className="form-floating mb-3">
                                    <input type="text" className="form-control" defaultValue={seekerDetails.lastName} {...register("lastName")}
                                           placeholder="David"/>
                                    <label htmlFor="floatingFirstName">Last name</label>
                                    <p className="error-message">{errors.lastName?.message}</p>
                                </div>


                                <div className="form-floating mb-3">
                                    <input type="text" className="form-control" defaultValue={seekerDetails.phoneNumber}  {...register("phoneNumber")}
                                           placeholder="David"/>
                                    <label htmlFor="floatingFirstName">Phone number</label>
                                    <p className="error-message">{errors.phoneNumber?.message}</p>
                                </div>


                            </div>
                        </div>

                        <div className="d-flex justify-content-end">
                            <button className="blue-submit-button" type="submit"> Save changes</button>
                        </div>

                    </form>
                </div>
            </>
        }


    </div>)
}