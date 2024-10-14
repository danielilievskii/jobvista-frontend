import "./JobAdDetails.css"
import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {JobAdvertisementActions} from "../../redux/actions/jobAdvertisementActions";
import {useParams} from "react-router";
import Roles from "../../enumerations/Roles";
import JobType from "../../enumerations/JobType";
import EmploymentStatus from "../../enumerations/EmploymentStatus";
import {formatRelativeTime} from "../../utils/utils";
import {AddJobAdModal} from "./AddJobAdModal";
import {ApplyToJobAdModal} from "../applications/ApplyToJobAdModal";
import {Link} from "react-router-dom";
import {RecruiterActions} from "../../redux/actions/recruiterActions";


export const JobAdDetails = () => {
    const dispatch = useDispatch();
    const [jobAd, setJobAd] = useState("")
    const [recruiterDetails, setRecruiterDetails] = useState("");
    const [role, setRole] = useState("")
    const {id} = useParams();
    const auth = useSelector(state => state.auth.currentUser);

    let logosState = useSelector(state => state.images.logos)
    const [logoDispatched, setLogoDispatched] = useState(false)
    const [logoView, setLogoView] = useState(null);

    useEffect(() => {
        setRole(auth.role)
    }, [auth])

    useEffect(() => {
        if (jobAd) {
            if (!logoDispatched && !logosState[jobAd.recruiterId]) {
                dispatch(RecruiterActions.downloadLogo(jobAd.recruiterId, (success, response) => {
                    if (success) {
                        setLogoView(response)
                        setLogoDispatched(true)
                    }
                }))
            } else {
                setLogoView(logosState[jobAd.recruiterId])
            }

        }

    }, [jobAd])


    useEffect(() => {
        JobAdvertisementActions.fetchJobAdvertisementById(id, (success, response) => {
            if (success) {
                setJobAd(response.data)
                JobAdvertisementActions.fetchRecruiterDetailsById(response.data.recruiterId, (successAgain, responseAgain) => {
                    if(successAgain) {
                        setRecruiterDetails(responseAgain.data)
                    }
                })
            }
        });
    }, [])
    return (<div className="container">
        <div className="row">
            <div className="col-md-9">
                <div className="details-wrap min-wrap">
                    <div className="row">
                        <div className="col-md-9">
                            <div className="title">
                                <h2>{jobAd.title} </h2>
                                <span className="job-type"> {jobAd.jobType===JobType.JOB ? "Job" : "Internship"}</span>
                                {!jobAd.active && <span className="expired">Expired</span>}
                            </div>

                            <p className="details-head-info">
                                <span><b>{jobAd.recruiterName}</b></span> • <span>{jobAd.industry}</span> • <span>{formatRelativeTime(jobAd.postedOn)}</span>
                            </p>

                            <p><i className="fa-solid fa-money-check-dollar"></i> <span>Hourly rate: ${jobAd.startingSalary}</span></p>
                            <p><i className="fa-solid fa-briefcase"></i> Employment status: {jobAd.employmentStatus==="FULL_TIME" ? "Full-time" : "Part-time"}</p>
                            <p><i className="fa-solid fa-calendar-days"></i> Active until: {new Date(jobAd.activeUntil).toLocaleString('default', { day: 'numeric', month: 'long',  year: 'numeric' })}</p>

                        </div>
                        <div className="col-md-3">
                            {jobAd.recruiterId &&
                                <>
                                    <img
                                        className="card-company-logo"
                                        // loading gif
                                        src={logosState[jobAd.recruiterId]}
                                        alt=""
                                        width={200} height={200}
                                    />
                                </>
                            }

                        </div>
                    </div>


                    <h4>About the job</h4>
                    {jobAd.description && (
                        <p dangerouslySetInnerHTML={{ __html: jobAd.description.replace(/\n/g, "<br>") }}></p>
                    )}
                    <ApplyToJobAdModal jobAd={jobAd} role={role}/>

                </div>
            </div>
            <div className="col-md-3">
                <div className="details-wrap">
                    <Link className="recruiter-link" to={`/recruiters/${jobAd.recruiterId}`}>{jobAd.recruiterName} </Link>

                    <h4>About the company</h4>
                    <p>
                        {recruiterDetails.companyDescription
                            ? recruiterDetails.companyDescription.length > 710
                                ? `${recruiterDetails.companyDescription.substring(0, 710)}...`
                                : recruiterDetails.companyDescription
                            : "There is no info about this company yet."
                        }
                    </p>

                    <p>
                        <i className="fa-solid fa-envelope"></i> <span className="span-about"> {recruiterDetails.contactEmail}</span> <br/>
                        <i className="fa-solid fa-phone"></i> <span className="span-about"> {recruiterDetails.contactPhoneNumber}</span> <br/>
                        {recruiterDetails.receptionist && <><i className="fa-solid fa-user"></i> <span className="span-about"> {recruiterDetails.receptionist}</span> </>}
                    </p>

                    <div className="d-flex justify-content-center mt-4">
                        <Link className="card-button" to={`/recruiters/${jobAd.recruiterId}`}>Read more </Link>
                    </div>
                </div>
            </div>

        </div>



    </div>)
}