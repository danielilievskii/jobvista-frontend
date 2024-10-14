import React, {useState} from "react";
import "../shared_css/Modal.css";

import 'react-responsive-modal/styles.css';
import {Modal} from 'react-responsive-modal';

//Validation
import * as yup from "yup";
import {yupResolver} from "@hookform/resolvers/yup";
import {Controller, useForm} from "react-hook-form";


import {useDispatch, useSelector} from "react-redux";
import Roles from "../../enumerations/Roles";
import {ApplicationActions} from "../../redux/actions/applicationActions";
import {notifyJobAdApply} from "../../utils/toastUtils";


export const ApplyToJobAdModal = (props) => {
    const {jobAd, role} = props
    const [modal, setModal] = useState(false);
    const dispatch = useDispatch();
    const auth = useSelector(state => state.auth.currentUser)

    const [resumeFile, setResumeFile] = useState(null);
    const toggleModal = () => {
        setModal(!modal);
    };

    const schema = yup.object().shape({
        answerOne: yup.string().required("Please answer the question"),
        answerTwo: yup.string().required("Please answer the question"),
        answerThree: yup.string().required("Please answer the question"),
        messageToRecruiter: yup.string(),
    })

    const {register, handleSubmit, control, formState: {errors}} = useForm({
        resolver: yupResolver(schema),
    });

    const submitApplication = async (values) => {
        try {
            const formData = new FormData();
            formData.append('jobSeekerId', auth.id);
            formData.append('jobAdId', jobAd.id);
            formData.append('resumeFile', resumeFile);
            formData.append('answerOne', values.answerOne);
            formData.append('answerTwo', values.answerTwo);
            formData.append('answerThree', values.answerThree);
            formData.append('messageToRecruiter', values.messageToRecruiter);

            dispatch(ApplicationActions.submitApplication(
                formData, (success) => {
                    if (success) {
                        toggleModal()
                        notifyJobAdApply()
                    }
                }
            ))
        } catch (err) {
            console.error(err)
        }
    }
    let minimumDate = new Date();
    minimumDate.setDate(minimumDate.getDate() + 1);

    return (<div className="modal-wrap">
        {role === Roles.JOBSEEKER &&
            <>
                {jobAd.active && <button onClick={toggleModal} className="apply-button apply">Apply now</button>}
                {!jobAd.active && <button className="card-button apply disabled">Apply now</button>}
            </>
        }
        <Modal open={modal} onClose={toggleModal} center>
            <div className="head-modal">
                <h3>Applying to {jobAd.title} at {jobAd.recruiterName}</h3>
                <i className="fa-solid fa-x btn-close-modal" onClick={toggleModal}></i>
            </div>

            <div className="modal-content">
                <form onSubmit={handleSubmit(submitApplication)}>
                    <div className="row">
                        <div className="col-md-6">
                            <label className="label">Why are you interested in joining our company?</label>
                            <textarea type="text" placeholder="Write your answer here..."
                                      {...register("answerOne")} className="application-textarea"/>
                            <p style={{color: "red"}}>{errors.answerOne?.message}</p>

                            <label className="label">What makes you a good fit for this position?</label>
                            <textarea type="text" placeholder="Write your answer here..."
                                      {...register("answerTwo")} className="application-textarea"/>
                            <p style={{color: "red"}}>{errors.answerTwo?.message}</p>

                            <label className="label">What do you hope to achieve in your first 6 months in this
                                role?</label>
                            <textarea type="text" placeholder="Write your answer here..."
                                      {...register("answerThree")} className="application-textarea"/>
                            <p style={{color: "red"}}>{errors.answerThree?.message}</p>

                        </div>
                        <div className="col-md-6">
                            <label htmlFor="start">Curriculum vitae (CV)</label>
                            <br/>
                            <input {...register("file")} className="resume-link"
                                   onChange={(e) => setResumeFile(e.target.files[0])} required type="file"
                                   id="fileUpload" accept=".pdf"/>
                            <br/>
                            <label className="label">Message to the recruiter</label>
                            <textarea type="text" placeholder="Optional..."
                                      {...register("messageToRecruiter")} className="application-textarea"/>

                            <br/><br/>
                            <p style={{color: "red"}}>Please note that your personal data from your account will be used
                                to identify and process your application.</p>
                        </div>
                    </div>

                    <div className="modal-buttons">
                        <div className="cancel-btn" onClick={toggleModal}> Cancel</div>
                        <button className="submit-btn"> Submit</button>
                    </div>

                </form>
            </div>
        </Modal>
    </div>)
}