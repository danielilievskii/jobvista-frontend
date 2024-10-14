import {useDispatch, useSelector} from "react-redux";
import {useEffect, useState} from "react";
import {useParams} from "react-router";
import {ApplicationActions} from "../../redux/actions/applicationActions";
import {ApplicationDetailsModal} from "./ApplicationDetailsModal";
import "./Applications.css"
import Select from "react-select";
import {sortElementsBy} from "../../utils/utils";
import {JobSeekerActions} from "../../redux/actions/JobSeekerActions";
import {notifyAppStatusUpdate} from "../../utils/toastUtils";

export const ApplicationsByJobAd = () => {

    const dispatch = useDispatch();
    let {advertisement_id} = useParams();

    const [applicationsByJobAd, setApplicationsByJobAd] = useState([]);
    let applicationsByJobAdState = useSelector(state => state.appl.applicationsByJobAdId)
    const [dispatched, setDispatched] = useState(false);

    const [profilePics, setProfilePics] = useState({});
    let profilePicsState = useSelector(state => state.images.profilePictures)
    const [profilePicsDispatched, setProfilePicsDispatched] = useState(false);

    const [jobAdTitle, setJobAdTitle] = useState("");

    const [changedApplications, setChangedApplications] = useState({});

    useEffect(() => {
        if(!dispatched) {
            dispatch(ApplicationActions.fetchApplicationsByJobAdId(advertisement_id, (success, reponse) => {
                if (success && reponse.data.length > 0) {
                    setApplicationsByJobAd(sortElementsBy(reponse.data, "submittedOn"))
                    setJobAdTitle(reponse.data[0].jobAdTitle)
                }
                setDispatched(true)
                console.log("Fetch applications by job ad GET")
            }))
        } else {
            setApplicationsByJobAd(sortElementsBy(applicationsByJobAdState, "submittedOn"));
            if(applicationsByJobAdState.length > 0) {
                setJobAdTitle(applicationsByJobAdState[0].jobAdTitle)
            }

        }

    }, [applicationsByJobAdState])

    useEffect(() => {
        if(dispatched && !profilePicsDispatched) {
            applicationsByJobAd.forEach(app => {
                if(app.jobSeekerId && !profilePics[app.jobSeekerId]) {
                    fetchProfilePic(app.jobSeekerId)
                }
            })
            setProfilePicsDispatched(true);
            console.log("Fetch all profile pics GET")
        } else if(profilePicsDispatched) {
            setProfilePics(profilePicsState)
            console.log("Fetch all profile pics STATE")
        }
    }, [dispatched])


    const fetchProfilePic = (jobSeekerId) => {
        dispatch(JobSeekerActions.downloadProfilePic(jobSeekerId, (success, response) => {
            if(success) {
                setProfilePics(prevState => ({...prevState, [jobSeekerId]: response}))
            }
        }))
    }

    const options = [
        {value: 'PROPOSED', label: <span><i className="fa-solid fa-paper-plane"></i> Proposed</span>},
        {value: 'UNDER_REVIEW', label: <span><i className="fa-solid fa-file-pen"></i> Under Review</span>},
        {value: 'ACCEPTED', label: <span><i className="fa-solid fa-user-check"></i> Accepted</span>},
        {value: 'DENIED', label: <span><i className="fa-solid fa-user-slash"></i> Denied</span>}
    ];

    const [selectedFilter, setSelectedFilter] = useState('All');

    const filters = [
        { value: 'ALL', label: 'All', icon: 'fa-folder-open' },
        { value: 'PROPOSED', label: 'Proposed', icon: 'fa-paper-plane' },
        { value: 'UNDER_REVIEW', label: 'Under Review', icon: 'fa-file-pen' },
        { value: 'ACCEPTED', label: 'Accepted', icon: 'fa-user-check' },
        { value: 'DENIED', label: 'Denied', icon: 'fa-user-slash' },
    ];

    const filterApplicationsByJobAdvertisement = (filter) => {
        dispatch(ApplicationActions.filterApplicationsByJobAdId(advertisement_id, filter, (success, response) => {
            if(success) {
                //notify
            }
        }))
    }

    let handleDefaultStatus = (status) => {
        return options.find(option => option.value === status);
    }

    let handleStatusChange = (selectedOption, id) => {

        const currentApplication = applicationsByJobAd.find(app => app.id === id);

        setChangedApplications(prevState => ({
            ...prevState,
            [id]: {
                ...prevState[id],
                response: (selectedOption.value === "ACCEPTED" || selectedOption.value === "DENIED") ? (prevState[id]?.response || currentApplication.response || "") : "",
                status: selectedOption.value
            }
        }))

       setApplicationsByJobAd(prevState => (
           prevState.map(application =>
           application.id === id ? {...application, status: selectedOption.value} : application)
       ))

        const responseTextarea = document.getElementById(`response-${id}`);
        if (responseTextarea) {
            responseTextarea.value = "";
        }

       /* dispatch(ApplicationActions.updateApplicationStatus(id, selectedOption.value, (success, response) => {
            if(success) {
                notifyAppStatusUpdate()
            }
        }))*/
    }

    let handleResponseChange = (e, id) => {

        const currentApplication = applicationsByJobAd.find(app => app.id === id);

        setChangedApplications(prevState => ({
                ...prevState,
                [id]: {
                    ...prevState[id],
                    response: e.target.value,
                    status: prevState[id]?.status || currentApplication.status,
                }
            }
        ))
    }

    const handleSaveChanges = () => {
       const changes = Object.entries(changedApplications).map(
           ([applicationId, change]) => ({
               id: applicationId,
               status: change.status,
               response: change.response,
           })
       );

       if(changes.length === 0) {
           return;
       }

       dispatch(ApplicationActions.updateApplications(changes, (success, response) => {
           if(success) {
               setChangedApplications({});
               notifyAppStatusUpdate()
           }
       }))


    }

    const isChangedApplication = (id) => {
        return changedApplications && Object.keys(changedApplications).includes(id.toString());
    };


    return (<div className="custom-container">
        <div className="application-title">
            {jobAdTitle ?
                <h3>Applications for <b>{jobAdTitle}</b></h3> :
                <h1></h1>
            }
        </div>

        <div className="row">
            <div className="col-md-6 application-filters-wrap">
                <div className="application-filters d-inline-flex flex-row justify-content-start">
                    {
                        filters.map(filter => (
                            <span
                                key={filter.label}
                                className={selectedFilter === filter.label ? "selected" : ""}
                                onClick={() => {
                                    setSelectedFilter(filter.label)
                                    filterApplicationsByJobAdvertisement(filter.value)
                                    setChangedApplications({});
                                }}
                            ><i className={`fa-solid ${filter.icon}`}></i> {filter.label}</span>
                        ))
                    }
                </div>

            </div>
            <div className="col-md-6 d-inline-flex flex-row justify-content-end">
                <button onClick={handleSaveChanges}
                        className={`blue-submit-button ${Object.keys(changedApplications).length === 0 ? 'disabled' : ''}`}
                        disabled={Object.keys(changedApplications).length === 0}
                >Submit Changes</button>
            </div>
        </div>



        {applicationsByJobAd && applicationsByJobAd.map((application, index) => (
            <div
                key={application.id}
                className={`application-card-wrapper ${(application.status !== "PROPOSED" ) ? 'expanded' : ''}`}
            >

                <div className={`application-card ${changedApplications[application.id] ? 'changed' : ''}`}>
                    <div className="app-job-seeker-pic">
                        <img
                            src={profilePicsState[application.jobSeekerId]}
                            alt=""
                            width={75} height={75}
                        />
                    </div>
                    <div className="app-info">
                <span>Submitted on <b>{new Date(application.submittedOn).toLocaleString('default', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                })}</b></span>
                        <div className="contact-info">
                            <div className="contact-item">
                                <i className="fa-solid fa-user"></i> <span>{application.jobSeekerName}</span>
                            </div>
                            <div className="contact-item">
                                <i className="fa-solid fa-envelope"></i> <span>{application.jobSeekerEmail}</span>
                            </div>
                            <div className="contact-item">
                                <i className="fa-solid fa-phone"></i> <span>{application.jobSeekerPhoneNumber}</span>
                            </div>
                        </div>
                    </div>

                    <div className="app-status">
                        <ApplicationDetailsModal application={application} />
                        <div className="select">
                            <Select options={options} onChange={(selectedOption) => handleStatusChange(selectedOption, application.id)} defaultValue={handleDefaultStatus(application.status)} />
                        </div>
                    </div>
                </div>

                <div className="expand-section">
                <textarea
                    id={`response-${application.id}`}
                    placeholder={application.status === "UNDER_REVIEW" ? "Request additional documents..." :"Write your response..."}
                    defaultValue={application.response}
                    onChange={(e) => handleResponseChange(e, application.id)}
                />
                </div>
            </div>
        ))}


    </div>)
}