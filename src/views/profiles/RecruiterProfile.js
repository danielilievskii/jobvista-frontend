import "../job_advertisements/JobAdvertisements.css"
import {useDispatch, useSelector} from "react-redux";
import {useEffect, useState} from "react";
import {JobAdvertisementActions} from "../../redux/actions/jobAdvertisementActions";
import {formatRelativeTime, sortElementsBy} from "../../utils/utils";
import {Link} from "react-router-dom";
import JobType from "../../enumerations/JobType";
import {RecruiterActions} from "../../redux/actions/recruiterActions";

import {useParams} from "react-router";


export const RecruiterProfile = () => {

    const dispatch = useDispatch();
    const {id} = useParams();
    const auth = useSelector(state => (state.auth.currentUser))

    const [jobAdvertisementsByRecruiter, setJobAdvertisementsByRecruiter] = useState([]);
    const [recruiterDetails, setRecruiterDetails] = useState(null);

    let logosState = useSelector(state => state.images.logos)
    const [logoDispatched, setLogoDispatched] = useState(false)
    const [logoView, setLogoView] = useState(null);

    const [activeJobListingsCount, setActiveJobListingsCount] = useState(0);


    useEffect(() => {

        JobAdvertisementActions.fetchRecruiterDetailsById(id, (success, response) => {
            if (success) {
                setRecruiterDetails(response.data)
            }
        })

    }, []);

    useEffect(() => {
        if (id) {
            if (!logoDispatched && !logosState[id]) {
                dispatch(RecruiterActions.downloadLogo(id, (success, response) => {
                    if (success) {
                        setLogoView(response)
                        setLogoDispatched(true)
                    }
                }))
            } else {
                setLogoView(logosState[id])
            }
        }

    }, [auth])

    useEffect(() => {

        dispatch(JobAdvertisementActions.fetchJobAdvertisementsByRecruiterProfile(id, (success, response) => {
            if (success && response.data.length > 0) {
                setJobAdvertisementsByRecruiter(sortElementsBy(response.data, "postedOn"))
                setActiveJobListingsCount(countActiveJobListings(response.data));
            }
        }))
    }, [])


    function countActiveJobListings(jobAds) {
        if (jobAds.length > 0) {
            const activeJobListings = jobAds.filter(job => job.active)
            return activeJobListings.length;
        }
        return 0;
    }


    return (<div className="my-workspace">
            <div className="custom-container no-additional-margin">
                <div className="photo-box">
                    <div>
                        <img
                            src="/images/default-company-banner.jpg"
                            className="company-banner"
                            alt="Company Banner"
                        />
                        <img
                            // loading gif
                            src={logoView}
                            className="company-logo"
                            alt=""
                            width={200} height={200}
                        />

                    </div>

                    <div className="info-tab">
                        <h3>{recruiterDetails && recruiterDetails.companyName}</h3>
                        <p>Active job listings: <span>{activeJobListingsCount}</span></p>
                    </div>
                </div>

                {recruiterDetails &&
                    <>
                        <div className="details-wrap-profile">
                            <h4>About the company</h4>
                            <p>{recruiterDetails.companyDescription ?
                                recruiterDetails.companyDescription : "There is no info about this company yet."
                            }</p>
                            <p>
                                <span> <i
                                    className="fa-solid fa-envelope"></i> {recruiterDetails.contactEmail}</span> • <span>
                                <i className="fa-solid fa-phone"></i> {recruiterDetails.contactPhoneNumber}</span>
                                {recruiterDetails.receptionist && <span> • <i
                                    className="fa-solid fa-user"></i> {recruiterDetails.receptionist}</span>}
                            </p>
                        </div>
                    </>
                }

                {/*<div className="line-separator"></div>*/}

                {/*<div className="head-dashboard-box">*/}
                {/*    <div className="row">*/}
                {/*        <div className="col-md-12 filter-container">*/}
                {/*            <div className="search-container">*/}
                {/*                <i className="fa-solid fa-magnifying-glass search-icon"></i>*/}
                {/*                <input*/}
                {/*                    className="search-input"*/}
                {/*                    type="text"*/}
                {/*                    placeholder="Search job advertisement by title..."*/}
                {/*                    value={searchTerm}*/}
                {/*                    onChange={event => setSearchTerm(event.target.value)}*/}
                {/*                />*/}
                {/*            </div>*/}
                {/*            <div className="sort-section item">*/}
                {/*                <Select*/}
                {/*                    defaultValue={{value: "all", label: "All industries"}}*/}
                {/*                    value={selectedIndustry.value}*/}
                {/*                    onChange={option => setSelectedIndustry(option.value)}*/}
                {/*                    options={industryOptionsFilter}*/}
                {/*                    className="sort-range sort"*/}
                {/*                />*/}
                {/*            </div>*/}
                {/*            <div className="sort-section item">*/}
                {/*                <Select*/}
                {/*                    defaultValue={{value: "newest", label: "Date (Newest First)"}}*/}
                {/*                    value={selectedSortOrder.value}*/}
                {/*                    onChange={option => setSelectedSortOrder(option.value)}*/}
                {/*                    options={sortOptions}*/}
                {/*                    className="sort-range sort"*/}
                {/*                />*/}
                {/*            </div>*/}
                {/*            <button onClick={filterJobAdvertisements} className="btn-open-modal">Find jobs</button>*/}
                {/*        </div>*/}
                {/*    </div>*/}
                {/*</div>*/}
                <div className="row row-cols-1 row-cols-md-4 g-4">

                    {jobAdvertisementsByRecruiter && jobAdvertisementsByRecruiter.map((jobAd, index) => (
                        <div key={index} className="col">
                            <div className="custom-card hub-card">
                                <div className="card-head">
                                    <span className="hourly-salary"><b>${jobAd.startingSalary}/hr</b></span>
                                    <span
                                        className="job-type"> {jobAd.jobType === JobType.JOB ? "Job" : "Internship"}</span>
                                    {!jobAd.active && <span className="expired">Expired</span>}
                                </div>
                                <div className="card-body">
                                    <h5 className="card-title">{jobAd.title}</h5>
                                    <span>{jobAd.industry} • <span style={{
                                        color: "black", fontWeight: "bold"
                                    }}>{formatRelativeTime(jobAd.postedOn)}</span></span>
                                    <div className="card-info">
                                        <span><i className="fa-solid fa-building"
                                                 style={{color: "#000000"}}></i> Company: <span style={{
                                            color: "black", fontWeight: "bold"
                                        }}>{jobAd.recruiterName}</span></span> <br/>
                                    </div>

                                </div>
                                <div className="card-foot">
                                    <Link to={`/job-advertisements/${jobAd.id}`} className="card-button">Read
                                        more</Link>
                                </div>
                            </div>
                        </div>))}

                </div>


            </div>
        </div>

    )
}