import {AddJobAdModal} from "./AddJobAdModal";

import "./JobAdvertisements.css"
import "../shared_css/Random.css"

import {useDispatch, useSelector} from "react-redux";
import {useEffect, useState} from "react";
import {JobAdvertisementActions} from "../../redux/actions/jobAdvertisementActions";
import {formatRelativeTime, sortElementsBy} from "../../utils/utils";
import {dataRangeOptions, industryOptions, industryOptionsFilter, sortOptions} from "../selectOptions";
import Select from "react-select";
import {DeleteJobAdModal} from "./DeleteJobAdModal";
import {EditJobAdModal} from "./EditJobAdModal";
import {Link} from "react-router-dom";
import JobType from "../../enumerations/JobType";
import {RecruiterActions} from "../../redux/actions/recruiterActions";


export const Workspace = (props) => {

    const dispatch = useDispatch();
    const [dispatched, setDispatched] = useState(false)

    const auth = useSelector(state => (state.auth.currentUser))

    const [jobAdvertisementsByRecruiter, setJobAdvertisementsByRecruiter] = useState([]);
    let jobAdvertisementsByRecruiterState = useSelector(state => (state.jobAd.jobAdvertisementsByRecruiter))

    const [recruiterDetails, setRecruiterDetails] = useState(null);

    const [selectedSortOrder, setSelectedSortOrder] = useState("date_newest");
    const [selectedIndustry, setSelectedIndustry] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");

    const [activeJobListingsCount, setActiveJobListingsCount] = useState(0);

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
        if (!dispatched && jobAdvertisementsByRecruiterState.length === 0) {
            dispatch(JobAdvertisementActions.fetchJobAdvertisementsByRecruiter(auth.id, (success, response) => {
                if (success && response.data.length > 0) {
                    setJobAdvertisementsByRecruiter(sortElementsBy(response.data))
                }
                console.log("Fetch job advertisements by recruiter GET")
            }))
            setDispatched(true);

        } else {
            setJobAdvertisementsByRecruiter(jobAdvertisementsByRecruiterState)
            console.log("Fetch job advertisements by recruiter STATE")

            setActiveJobListingsCount(countActiveJobListings(jobAdvertisementsByRecruiterState));
        }

    }, [jobAdvertisementsByRecruiterState])

    let filterJobAdvertisements = () => {
        JobAdvertisementActions.filterJobAdvertisementsByRecruiter(auth.id, {
            searchTerm: searchTerm, industry: selectedIndustry, sortOrder: selectedSortOrder
        }, (success, response) => {
            if (success) {
                setJobAdvertisementsByRecruiter(response.data);
            }
        })
    }

    function countActiveJobListings(jobAds) {
        if (jobAds.length > 0) {
            const activeJobListings = jobAds.filter(job => job.active)
            return activeJobListings.length;
        }
        return 0;
    }

    return (<div className="container">

            {/*<div className="line-separator"></div>*/}

            <div className="filter-container">
                <div className="row">
                    <div className="col-md-12 filter-box">
                        <div className="search-container">
                            <i className="fa-solid fa-magnifying-glass search-icon"></i>
                            <input
                                className="search-input"
                                type="text"
                                placeholder="Search job advertisement by title..."
                                value={searchTerm}
                                onChange={event => setSearchTerm(event.target.value)}
                            />
                        </div>
                        <div className="sort-section item">
                            <Select
                                defaultValue={{value: "all", label: "All industries"}}
                                value={selectedIndustry.value}
                                onChange={option => setSelectedIndustry(option.value)}
                                options={industryOptionsFilter}
                                className="sort-range sort"
                            />
                        </div>
                        <div className="sort-section item">
                            <Select
                                defaultValue={{value: "newest", label: "Date (Newest First)"}}
                                value={selectedSortOrder.value}
                                onChange={option => setSelectedSortOrder(option.value)}
                                options={sortOptions}
                                className="sort-range sort"
                            />
                        </div>
                        <button onClick={filterJobAdvertisements} className="blue-submit-button">Find jobs</button>
                    </div>
                </div>
            </div>
            <div className="row row-cols-1 row-cols-md-5 g-3">
                <AddJobAdModal/>

                {jobAdvertisementsByRecruiter && jobAdvertisementsByRecruiter.map((jobAd, index) => (
                    <div key={index} className="col">
                        <div className="custom-card hub-card">
                            <div className="card-head">
                                <span className="hourly-salary"><b>${jobAd.startingSalary}/hr</b></span>
                                <span
                                    className="job-type"> {jobAd.jobType === JobType.JOB ? "Job" : "Internship"}</span>
                                {!jobAd.active && <span className="expired">Expired</span>}
                                <div className="card-management-btns">
                                    <DeleteJobAdModal props={jobAd}/>
                                    <EditJobAdModal props={jobAd}/>
                                </div>
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
                                <Link to={`/job-management-hub/applications/${jobAd.id}`}
                                      className="card-button">View applications</Link>
                            </div>
                        </div>
                    </div>))}
            </div>
        </div>


    )
}