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
import {Editor} from "primereact/editor";
import {notifyJobAdDelete, notifyJobAdEdit} from "../../utils/toastUtils";


export const EditJobAdModal = (jobAd) => {
    const [modal, setModal] = useState(false);
    const dispatch = useDispatch();
    const auth = useSelector(state => state.auth.currentUser)
    const toggleModal = () => {
        console.log("NAD SET")
        setModal(!modal);
        console.log("POD SET")

    };

    const schema = yup.object().shape({
        title: yup.string().required("Please enter a title"),
        description: yup.string().required("Please enter a description"),
        industry: yup.mixed().required("Select industry"),
        startingSalary: yup.number().required("Please enter the starting salary"),
        jobType: yup.mixed().required("Select job type"),
        employmentStatus: yup.mixed().required("Select employment status"),
    })

    const {register, handleSubmit, control, formState: {errors}} = useForm({
        resolver: yupResolver(schema),
    });
    const editJobAdvertisement = async (values) => {
        try {
            dispatch(JobAdvertisementActions.editJobAdvertisement(
                {
                    email: auth.email,
                    title: values.title,
                    description: values.description,
                    industry: values.industry.value,
                    startingSalary: values.startingSalary,
                    activeUntil: values.date,
                    jobType: values.jobType.value,
                    employmentStatus: values.employmentStatus.value,
                }, jobAd.props.id, (success) => {
                    if(success) {
                        toggleModal()
                        notifyJobAdEdit()
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

        <i className="fa-solid fa-pen-to-square pen-edit-btn" onClick={() => {
            // setSelectedRecord(record);
                toggleModal()
        }}></i>
        <Modal open={modal} onClose={toggleModal} center classNames="job-advertisement-modal">
            <div className="head-modal">
                <h3>Edit Job Advertisement</h3>
                <i className="fa-solid fa-x btn-close-modal" onClick={toggleModal}></i>
            </div>

            <div className="modal-content">
                <form>
                    <div className="row">
                        <div className="col-md-7">
                            <label className="label">Job title:</label>
                            <input type="text" defaultValue={jobAd.props.title} {...register("title")}/>
                            <p style={{color: "red"}}>{errors.title?.message}</p>

                            <label className="label">Job description:</label>
                            {/*<textarea type="text" defaultValue={jobAd.props.description} placeholder="Describe the job position and all the requirements"*/}
                            {/*          className="description-textarea" {...register("description")}/>*/}

                            <Controller
                                name="description"
                                control={control}
                                defaultValue={jobAd.props.description}
                                render={({ field }) => (
                                    <Editor
                                        // defaultValue={jobAd.props.description}
                                        value={jobAd.props.description}
                                        onTextChange={(e) => field.onChange(e.htmlValue)}
                                        style={{ height: '300px', fontSize: "16px", fontFamily: "Segoe UI" }}
                                    />
                                )}
                            />

                            <p style={{color: "red"}}>{errors.description?.message}</p>
                        </div>

                        <div className="col-md-5">
                            <label className="label">Hourly rate:</label>
                            <input type="number" defaultValue={jobAd.props.startingSalary} {...register("startingSalary")}/>
                            <p style={{color: "red"}}>{errors.startingSalary?.message}</p>

                            <label className="label">Industry:</label>
                            <Controller
                                name="industry"
                                control={control}
                                defaultValue={{
                                    label: jobAd.props.industry,
                                    value: jobAd.props.industry
                                }}
                                render={({ field })  => (<Select
                                    {...field}
                                    options={industryOptions}
                                />)}
                            />
                            <p style={{color: "red"}}>{errors.industry?.message}</p>

                            <label className="label">Job type:</label>
                            <Controller
                                name="jobType"
                                control={control}
                                defaultValue={{
                                    value: jobAd.props.jobType,
                                    label: jobAd.props.jobType==="JOB" ? "Job" : "Internship"
                                }}
                                render={({ field }) => (
                                    <Select
                                    {...field}
                                    options={jobTypeOptions}
                                />)}
                            />
                            <p style={{color: "red"}}>{errors.jobType?.message}</p>

                            <label className="label">Employment status</label>
                            <Controller
                                name="employmentStatus"
                                control={control}
                                defaultValue={{
                                    value: jobAd.props.employmentStatus,
                                    label: jobAd.props.employmentStatus==="FULL_TIME" ? "Full time" : "Part time"
                                }}
                                render={({ field }) => (
                                    <Select
                                    {...field}
                                    options={employmentStatusOptions}
                                />)}
                            />
                            <p style={{color: "red"}}>{errors.employmentStatus?.message}</p>

                            <label htmlFor="start">Active until:</label>
                            <input type="date" defaultValue={new Date(jobAd.props.activeUntil).toLocaleDateString('en-CA')}
                                   min={minimumDate.toLocaleDateString('en-CA')} onChange={(event) => console.log(event.target.value)}
                                   {...register("date")}/>


                        </div>
                    </div>

                    <div className="modal-buttons">
                        <div className="cancel-btn" onClick={toggleModal}> Cancel</div>
                        <button className="submit-btn" onClick={handleSubmit(editJobAdvertisement)}> Save changes</button>
                    </div>
                </form>
            </div>
        </Modal>
    </div>)
}