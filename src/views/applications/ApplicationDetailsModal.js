import React, {useEffect, useState} from "react";
import "../shared_css/Modal.css";

import 'react-responsive-modal/styles.css';
import {Modal} from 'react-responsive-modal';
import Select from "react-select";

//Validation
import * as yup from "yup";
import {yupResolver} from "@hookform/resolvers/yup";
import {Controller, useForm} from "react-hook-form";


import {employmentStatusOptions, industryOptions, jobTypeOptions} from "../selectOptions";
import {useDispatch, useSelector} from "react-redux";
import {JobAdvertisementActions} from "../../redux/actions/jobAdvertisementActions";
import Roles from "../../enumerations/Roles";
import {ApplicationActions} from "../../redux/actions/applicationActions";
import {notifyJobAdApply, notifyJobAdUpdate} from "../../utils/toastUtils";


export const ApplicationDetailsModal = (props) => {
    const {application} = props
    const [modal, setModal] = useState(false);
    const dispatch = useDispatch();
    const auth = useSelector(state => state.auth.currentUser)
    const [resumeUrl, setResumeUrl] = useState("");
    const [additionalFileUrls, setAdditionalFileUrls] = useState([]);

    const [additionalFiles, setAdditionalFiles] = useState(null);
    const toggleModal = () => {
        setModal(!modal);
    };

    const {register, handleSubmit, control, formState: {errors}} = useForm();

    useEffect(() => {
        if (application) {
            ApplicationActions.downloadResume(application.id, (success, response) => {
                if (success) {
                    setResumeUrl(response);

                    if (application.additionalFileNames.length > 0) {
                        ApplicationActions.downloadAdditionalFiles(application.id, (success2, response) => {
                            if (success2) {
                                setAdditionalFileUrls(response);
                            }
                        })
                    }
                }
            })
        }
    }, [])

    const updateApplication = async () => {
        try {
            const formData = new FormData();
            if (additionalFiles && additionalFiles.length > 0) {
                for (let i = 0; i < additionalFiles.length; i++) {
                    formData.append('additionalFiles', additionalFiles[i]);
                }
            }

            dispatch(ApplicationActions.updateApplication(application.id, formData, (success) => {
                if (success) {
                    toggleModal()
                    window.location.reload()
                }
            }))
        } catch (err) {
            console.error(err)
        }
    }

    function getFileName(path) {
        let fileName = path.split('\\').pop().split('/').pop();

        fileName = fileName.trim();

        return fileName;
    }

    return (<div className="modal-wrap">
        {auth.role === Roles.RECRUITER ? <button onClick={toggleModal} className="application-button">View
            application</button> : (application.status === "UNDER_REVIEW" && application.response.length > 0 && additionalFileUrls.length === 0) ?
            <button onClick={toggleModal} className="application-button">Update application</button> :
            <button onClick={toggleModal} className="application-button">View application</button>}

        <Modal open={modal} onClose={toggleModal} center>
            <div className="head-modal">
                <h3>{application.jobSeekerName}'s application for {application.jobAdTitle}</h3>
                <i className="fa-solid fa-x btn-close-modal" onClick={toggleModal}></i>
            </div>

            <div className="modal-content">
                <form onSubmit={handleSubmit(updateApplication)}>
                    <div className="row">
                        <div className="col-md-6 d-flex flex-column gap-4">
                            <div>
                                <label className="label">Why are you interested in joining our company?</label>
                                <textarea disabled type="text" defaultValue={application.questionAnswers[0]} disabled
                                          placeholder="Write your answer here..." className="application-textarea"/>
                            </div>

                            <div>
                                <label className="label">What makes you a good fit for this position?</label>
                                <textarea disabled type="text" defaultValue={application.questionAnswers[1]}
                                          placeholder="Write your answer here..." className="application-textarea"/>
                            </div>

                            <div>
                                <label className="label">What do you hope to achieve in your first 6 months in this
                                    role?</label>
                                <textarea disabled type="text" defaultValue={application.questionAnswers[2]}
                                          placeholder="Write your answer here..." className="application-textarea"/>
                            </div>


                        </div>
                        <div className="col-md-6 d-flex flex-column gap-4">
                            <div>
                                <label className="label" htmlFor="start">Curriculum vitae (CV)</label>

                                <a className="resume-link" href={resumeUrl} target="_blank"
                                   rel="noopener noreferrer">{getFileName(application.fileName)}</a>
                            </div>

                            <div>
                                <label className="label">Message to the recruiter</label>
                                <textarea disabled type="text" defaultValue={application.message}
                                          placeholder="Optional..."
                                          className="application-textarea"/>
                            </div>


                            {additionalFileUrls.length > 0 ? (<div>
                                    <label className="label" htmlFor="start">Additional documents</label>
                                    <ul style={{listStyleType: "none", padding: 0, margin: 0}}>
                                        {additionalFileUrls.map((url, index) => (
                                            <li style={{marginBottom: 10}} key={index}>
                                                <a href={url} className="resume-link" download target="_blank">
                                                    {getFileName(url)}
                                                </a>
                                            </li>))}
                                    </ul>
                                </div>) : (<div>
                                    {(application.status === "UNDER_REVIEW" && application.response.length > 0 && auth.role == Roles.JOBSEEKER) &&
                                        <div>
                                            <label className="label" htmlFor="start">Additional documents</label>
                                            <input
                                                className="resume-link"
                                                onChange={(e) => setAdditionalFiles(e.target.files)}
                                                required type="file"
                                                id="fileUpload"
                                                accept=".pdf"
                                                multiple
                                            />
                                        </div>}
                                </div>
                            )}


                        </div>
                    </div>
                    {(additionalFileUrls.length  === 0 && application.status === "UNDER_REVIEW" && application.response.length > 0 && auth.role == Roles.JOBSEEKER) &&
                        <div className="modal-buttons">
                            <div className="cancel-btn" onClick={toggleModal}> Cancel</div>
                            <button className="submit-btn"> Submit</button>
                        </div>}

                </form>


            </div>
        </Modal>
    </div>)
}