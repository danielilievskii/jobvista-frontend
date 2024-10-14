import React, {useState} from "react";
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
import {notifyJobAdDelete} from "../../utils/toastUtils";


export const DeleteJobAdModal = (jobAd) => {
    const [modal, setModal] = useState(false);
    const dispatch = useDispatch();
    const auth = useSelector(state => state.auth.currentUser)
    const toggleModal = () => {
        setModal(!modal);
    };

    const deleteJobAdvertisement = async () => {
        try {
            dispatch(JobAdvertisementActions.deleteJobAdvertisement(jobAd.props.id, (success) => {
                if (success) {
                    toggleModal()
                    notifyJobAdDelete()
                }
            }))
        } catch (err) {
            console.error(err)
        }
    }

    return (<div className="modal-wrap">
        <i className="fa-solid fa-trash trash-delete-btn" onClick={toggleModal}></i>
        <Modal open={modal} onClose={toggleModal} center classNames="job-advertisement-modal">
            <i className="fa-solid fa-x btn-close-modal" style={{color: "black"}} onClick={toggleModal}></i>
            <div className="modal-delete-content">
                <div className="row modal-delete-content-inside">
                    <div className="col-md-1"><i className="fa-regular fa-circle-xmark x-icon"></i></div>
                    <div className="col-md-11 modal-delete-text">
                        <h4>Are you sure?</h4>
                        <p>Do you really want to delete this advertisement? This process cannot be undone.</p>
                    </div>
                </div>
                <div className="modal-delete-buttons">
                    <button className="cancel-btn" onClick={toggleModal}>Cancel</button>
                    <button className="delete-btn" onClick={deleteJobAdvertisement}> Delete</button>
                </div>
            </div>
        </Modal>
    </div>)
}