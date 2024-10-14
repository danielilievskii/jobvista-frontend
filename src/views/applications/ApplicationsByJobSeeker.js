import {useDispatch, useSelector} from "react-redux";
import {useEffect, useState} from "react";
import {ApplicationActions} from "../../redux/actions/applicationActions";
import {ApplicationDetailsModal} from "./ApplicationDetailsModal";
import Select from "react-select";

import {RecruiterActions} from "../../redux/actions/recruiterActions";
import {sortElementsBy} from "../../utils/utils";
import {Link} from "react-router-dom";

export const ApplicationsByJobSeeker = () => {
    const dispatch = useDispatch();
    const auth = useSelector(state => state.auth.currentUser);

    const [applicationsByJobSeeker, setApplicationsByJobSeeker] = useState([]);
    let applicationsByJobSeekerState = useSelector(state => state.appl.applicationsByJobSeeker);
    const [dispatched, setDispatched] = useState(false);

    const [logos, setLogos] = useState({});
    let logosState = useSelector(state => state.images.logos)
    const [logoDispatched, setLogoDispatched] = useState(false);


    useEffect(() => {
        if (!dispatched && (applicationsByJobSeekerState.length === 0 || applicationsByJobSeekerState.length === 1)) {
            dispatch(ApplicationActions.fetchApplicationsByJobSeeker(auth.id, (success, response) => {
                if (success && response.data.length > 0) {
                    setApplicationsByJobSeeker(sortElementsBy(response.data, "submittedOn"));
                }
                setDispatched(true)
                console.log("Fetch applications by job seeker GET")
            }))

        } else {
            setApplicationsByJobSeeker(sortElementsBy(applicationsByJobSeekerState, "submittedOn"));
            console.log("Fetch applications by job seeker STATE")
        }
    }, [applicationsByJobSeekerState])

    useEffect(() => {

        if (dispatched && !logoDispatched) {
            applicationsByJobSeeker.forEach(jobAd => {
                if (jobAd.recruiterId && !logos[jobAd.recruiterId]) {
                    fetchLogo(jobAd.recruiterId);
                }
            })
            setLogoDispatched(true)
            console.log("Fetch all logos GET")
        } else if (logoDispatched) {
            setLogos(logosState)
            console.log("Fetch all logos STATE")

        }

    }, [dispatched, logosState])


    const fetchLogo = (recruiterId) => {
        dispatch(RecruiterActions.downloadLogo(recruiterId, (success, response) => {
            if (success) {
                setLogos(prevLogos => ({...prevLogos, [recruiterId]: response}))
            }
        }));
    };

    const options = [{
        value: 'PROPOSED', label: <span className="status" style={{backgroundColor: '#4A90E2'}}><i
            className="fa-solid fa-paper-plane"></i> Proposed</span>
    }, {
        value: 'UNDER_REVIEW', label: <span className="status" style={{backgroundColor: '#F5A623'}}><i
            className="fa-solid fa-file-pen"></i> Under Review</span>
    }, {
        value: 'ACCEPTED', label: <span className="status" style={{backgroundColor: '#7ED321'}}><i
            className="fa-solid fa-user-check"></i> Accepted</span>
    }, {
        value: 'DENIED', label: <span className="status" style={{backgroundColor: '#D0021B'}}><i
            className="fa-solid fa-user-slash"></i> Denied</span>
    }];

    const [selectedFilter, setSelectedFilter] = useState('All');

    const filters = [
        { value: 'ALL', label: 'All', icon: 'fa-folder-open' },
        { value: 'PROPOSED', label: 'Proposed', icon: 'fa-paper-plane' },
        { value: 'UNDER_REVIEW', label: 'Under Review', icon: 'fa-file-pen' },
        { value: 'ACCEPTED', label: 'Accepted', icon: 'fa-user-check' },
        { value: 'DENIED', label: 'Denied', icon: 'fa-user-slash' },
    ];

    const filterApplicationsByJobSeeker= (filter) => {
        dispatch(ApplicationActions.filterApplicationsByJobSeeker(auth.id, filter, (success, response) => {
            if(success) {
                //notify
            }
        }))
    }

    let handleDefaultValue = (status) => {
        return options.find(option => option.value === status);
    }


    return (<div className="custom-container">

            <div className="application-title">
                <h3>Application history</h3>
            </div>

        <div className="application-filters d-inline-flex flex-row justify-content-start">
            {
                filters.map(filter => (
                    <span
                        key={filter.label}
                        className={selectedFilter === filter.label ? "selected" : ""}
                        onClick={() => {
                            setSelectedFilter(filter.label)
                            filterApplicationsByJobSeeker(filter.value)
                        }}
                    ><i className={`fa-solid ${filter.icon}`}></i> {filter.label}</span>
                ))
            }
        </div>

            {applicationsByJobSeeker && applicationsByJobSeeker.map((application, index) => (
                <div className="application-card-wrapper">
                    <div key={index} className="application-card">
                        <div className="app-company-logo">
                            <img
                                // loading gif
                                src={logosState[application.recruiterId]}
                                alt=""
                                width={75} height={75}
                            />
                        </div>

                        <div className="app-info">
                            <Link to={`/job-advertisements/${application.jobAdId}`}
                                  className="jobAd-title">{application.jobAdTitle}</Link>
                            {/*<h5 className="jobAd-title"></h5>*/}
                            <div className="contact-info">
                                <div className="contact-item">
                                    <i className="fa-solid fa-building"></i> <span>{application.recruiterName}</span>
                                </div>
                                <div className="contact-item">
                                    <i className="fa-solid fa-envelope"></i> <span>{application.recruiterEmail}</span>
                                </div>
                                <div className="contact-item">
                                    <i className="fa-solid fa-phone"></i>
                                    <span>{application.recruiterPhoneNumber}</span>
                                </div>
                                <span> • Submitted on <b>{new Date(application.submittedOn).toLocaleString('default', {
                                    day: 'numeric', month: 'long', year: 'numeric'
                                })}</b></span>
                            </div>
                        </div>

                        <div className="app-status">
                            <ApplicationDetailsModal application={application}/>
                            <> {handleDefaultValue(application.status).label}</>
                            {/*<div className="select">*/}
                            {/*    <Select isDisabled={true} options={options} />*/}
                            {/*</div>*/}

                        </div>
                    </div>
                    {application.response &&
                        <div className="response-message">
                            {application.response}
                        </div>
                    }

                </div>

            ))}

        </div>)
}