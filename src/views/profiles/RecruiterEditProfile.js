import {useDispatch, useSelector} from "react-redux";
import React, {useEffect, useState} from "react";
import {RecruiterActions} from "../../redux/actions/recruiterActions";
import * as yup from "yup";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";

// Toast notification
import 'react-toastify/dist/ReactToastify.css';
import { toast, ToastContainer } from 'react-toastify';
import {notifyLogoChange, notifyProfileEdit} from "../../utils/toastUtils";
export const RecruiterEditProfile = () => {

    const dispatch = useDispatch();
    const auth = useSelector(state => (state.auth.currentUser))

    const [recruiterDetails, setRecruiterDetails] = useState(null);

    let logosState = useSelector(state => state.images.logos)
    const [logoDispatched, setLogoDispatched] = useState(false)
    const [logoFile, setLogoFile] = useState(null);
    const [logoPreview, setLogoPreview] = useState(null);
    const [logoView, setLogoView] = useState(null);


    useEffect(() => {
        if (auth) {
            dispatch(RecruiterActions.fetchRecruiterEditDetailsById(auth.id, (success, response) => {
                if (success) {
                    setRecruiterDetails(response.data)
                }
            }))
        }
    }, [auth]);

    useEffect(() => {
        if (auth.id) {
            if (!logoDispatched && !logosState[auth.id]) {
                dispatch(RecruiterActions.downloadLogo(auth.id, (success, response) => {
                    if (success) {
                        setLogoView(response)
                        setLogoDispatched(true)
                    }
                }))
                console.log("LOGO GET")
            } else {
                setLogoView(logosState[auth.id])
                console.log("LOGO STATE")
            }
        }

    }, [auth])

    const schema = yup.object().shape({
        email: yup.string().required("Please enter your email"),
        companyName: yup.string().required("Please enter your company name"),
        companyDescription: yup.string(),
        contactEmail: yup.string().required("Please enter your contact email"),
        contactPhoneNumber: yup.string().required("Please enter your contact phone number"),
        receptionist: yup.string(),
    })

    const {register, handleSubmit, control, formState: {errors}} = useForm({
        resolver: yupResolver(schema),
    });


    const editRecruiterDetails = async (values) => {
        try {
            dispatch(RecruiterActions.editRecruiterDetailsById(
                {
                    email: values.email,
                    companyName: values.companyName,
                    companyDescription: values.companyDescription,
                    contactEmail: values.contactEmail,
                    contactPhoneNumber: values.contactPhoneNumber,
                    receptionist: values.receptionist,

                }, auth.id, (success, response) => {
                    if (success) {
                        console.log("Recruiter details edited")
                        notifyProfileEdit()
                        //window.location.reload();
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
            setLogoFile(file);
            setLogoPreview(URL.createObjectURL(file));
        }
        event.target.value = null;
    };

    const handleLogoUpload = async () => {
        try {
            const formData = new FormData();
            formData.append("recruiterId", auth.id);
            formData.append("logoFile", logoFile);

            dispatch(RecruiterActions.submitLogo(formData, (success, response) => {
                if (success) {
                    //console.log("Logo uploaded successfully")
                    notifyLogoChange()
                    setLogoPreview(null)
                    setLogoView(URL.createObjectURL(logoFile))
                }
            }))

        } catch (error) {
            console.error(error)
        }
    }

    const handleCancelUpload = () => {
        setLogoFile(null)
        setLogoPreview(null)
        console.log(logoPreview)
    }

    return (<div className="my-workspace">
            {logoPreview && (
                <div className="confirmation-bar">
                    <div className="confirmation-bar-buttons">
                        <button className="cancel-changes" onClick={handleCancelUpload}>Cancel</button>
                        <button className="save-changes" onClick={handleLogoUpload}>Save changes</button>

                    </div>
                </div>
            )}

            <div className="custom-container no-additional-margin">
                <div className="photo-box">
                    <div>
                        <img
                            src="/images/default-company-banner.jpg"
                            className="company-banner"
                            alt="Company Banner"
                        />
                        {logoPreview ? <>
                            <img
                                src={logoPreview}
                                className="company-logo"
                                alt=""
                                width={200} height={200}
                            />
                        </> : <>
                            <img
                                // loading gif
                                src={logoView}
                                className="company-logo"
                                alt=""
                                width={200} height={200}
                            />
                        </>}
                    </div>

                    <div className="info-tab">
                        <h3>{recruiterDetails && recruiterDetails.companyName}</h3>
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
                            <i className="fa-solid fa-camera"></i> Change logo
                        </button>
                        <button><i className="fa-solid fa-panorama"></i> Change cover photo</button>
                    </div>

                </div>


                {/*<i className="fa-solid fa-circle-exclamation">*/}
                {recruiterDetails && (
                    <div className="floating-wrap">
                        <h5>Company details</h5>
                        <form onSubmit={handleSubmit(editRecruiterDetails)}>
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="form-floating mb-3">
                                        <input type="text" className="form-control" defaultValue={recruiterDetails.email} {...register("email")}
                                               placeholder="David"/>
                                        <label htmlFor="floatingFirstName">Email address</label>
                                        <p className="error-message">{errors.email?.message}</p>
                                    </div>

                                    <div className="form-floating mb-3">
                                        <input type="text" className="form-control" defaultValue={recruiterDetails.contactEmail} {...register("contactEmail")}
                                               placeholder="David"/>
                                        <label htmlFor="floatingFirstName">Contact email address</label>
                                        <p className="error-message">{errors.contactEmail?.message}</p>
                                    </div>


                                    <div className="form-floating mb-3">
                                        <input type="text" className="form-control" defaultValue={recruiterDetails.contactPhoneNumber} {...register("contactPhoneNumber")}
                                               placeholder="David"/>
                                        <label htmlFor="floatingFirstName">Contact phone number</label>
                                        <p className="error-message">{errors.contactPhoneNumber?.message}</p>
                                    </div>

                                    <div className="form-floating mb-3">
                                        <input type="text" className="form-control" defaultValue={recruiterDetails.receptionist} {...register("receptionist")}
                                               placeholder="David"/>
                                        <label htmlFor="floatingFirstName">Receptionist</label>
                                        <p className="error-message">{errors.receptionist?.message}</p>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-floating mb-3">
                                        <input type="text" className="form-control" defaultValue={recruiterDetails.companyName} {...register("companyName")}
                                               placeholder="David"/>
                                        <label htmlFor="floatingCompanyName">Company name</label>
                                        <p className="error-message">{errors.companyName?.message}</p>
                                    </div>

                                    <div className="form-floating mb-3">
                                <textarea placeholder="Company description" defaultValue={recruiterDetails.companyDescription} className="form-control custom-text-area"
                                          name="" id="" cols="30" rows="9" {...register("companyDescription")}></textarea>
                                        <label htmlFor="floatingCompanyName">Company description</label>
                                    </div>

                                </div>
                            </div>
                            <div className="d-flex justify-content-end">
                                <button className="blue-submit-button" type="submit">Save changes</button>
                            </div>
                        </form>
                    </div>
                )}
                {/*<div className="line-separator"></div>*/}
            </div>
        </div>

    )
}