import "../shared_css/Random.css"

import {useDispatch, useSelector} from "react-redux";
import {useEffect, useState} from "react";
import {JobAdvertisementActions} from "../../redux/actions/jobAdvertisementActions";
import {formatRelativeTime, sortElementsBy} from "../../utils/utils";
import {dataRangeOptions, industryOptions, industryOptionsFilter, sortOptions} from "../selectOptions";
import Select from "react-select";
import Roles from "../../enumerations/Roles";
import {Link} from "react-router-dom";
import JobType from "../../enumerations/JobType";
import {AUTH_TOKEN} from "../../axios/axiosInstance";
import {jwtDecode} from "jwt-decode";
import {RecruiterActions} from "../../redux/actions/recruiterActions";

export const Dashboard = () => {

    const dispatch = useDispatch();

    const [jobAdvertisements, setJobAdvertisements] = useState([]);
    let jobAdvertisementsState = useSelector(state => state.jobAd.jobAdvertisements)
    const [jobDispatched, setJobDispatched] = useState(false);

    const [logos, setLogos] = useState({});
    let logosState = useSelector(state => state.images.logos)
    const [logoDispatched, setLogoDispatched] = useState(false);

    const auth = useSelector(state => state.auth);

    // const [role, setRole] = useState("");
    const [selectedSortOrder, setSelectedSortOrder] = useState("date_newest");
    const [selectedIndustry, setSelectedIndustry] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");


    useEffect(() => {
        if (!jobDispatched && jobAdvertisementsState.length == 0) {
            dispatch(JobAdvertisementActions.fetchJobAdvertisements((success, response) => {
                if (success && response.data.length > 0) {
                    setJobAdvertisements(sortElementsBy(response.data, "postedOn"))
                }
                setJobDispatched(true)
                console.log("Fetch all job advertisements GET")
            }))

        } else {
            setJobAdvertisements(sortElementsBy(jobAdvertisementsState, "postedOn"))
            console.log("Fetch all job advertisements STATE")


        }
    }, [jobAdvertisementsState])

    useEffect(() => {

        if(jobDispatched && !logoDispatched) {
            jobAdvertisements.forEach(jobAd => {
                if(jobAd.recruiterId && !logos[jobAd.recruiterId]) {
                    fetchLogo(jobAd.recruiterId);
                }
            })
            setLogoDispatched(true)
            console.log("Fetch all logos GET")
        } else {
            setLogos(logosState)
            console.log("Fetch all logos STATE")
        }

        }, [jobDispatched, logosState])

    const fetchLogo = (recruiterId) => {
        dispatch(RecruiterActions.downloadLogo(recruiterId, (success, response) => {
            if(success) {
                setLogos(prevLogos => ({...prevLogos, [recruiterId]: response}))
            }
        }));
    };

    let filterJobAdvertisements = () => {
        JobAdvertisementActions.filterJobAdvertisements(
            {
                searchTerm: searchTerm,
                industry: selectedIndustry,
                sortOrder: selectedSortOrder
            }, (success, response) => {
                if (success) {
                    setJobAdvertisements(response.data);
                }
            }
        )
    }

    return (

        <div className="container">
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
            <div className="row row-cols-2 row-cols-md-4 g-4">
                {jobAdvertisements &&
                    jobAdvertisements.map((jobAd, index) => (
                        <div key={index} className="col">
                            <div className="custom-card dashboard-card">
                                <div className="card-head">
                                    <span className="hourly-salary"><b>${jobAd.startingSalary}/hr</b></span>
                                    <span
                                        className="job-type"> {jobAd.jobType === JobType.JOB ? "Job" : "Internship"}</span>
                                    {!jobAd.active && <span className="expired">Expired</span>}
                                </div>
                                <div className="card-body">
                                    <img className="card-company-logo"
                                        // loading gif
                                        src={logos[jobAd.recruiterId]}
                                        alt=""
                                        width={100} height={100}
                                    />
                                    <h5 className="card-title">{jobAd.title}</h5>
                                    <span>{jobAd.industry} • <span style={{
                                        color: "black",
                                        fontWeight: "bold"
                                    }}>{formatRelativeTime(jobAd.postedOn)}</span></span>
                                    <div className="card-info">
                                        <span><i className="fa-solid fa-building"
                                                 style={{color: "#000000"}}></i> Company: <span style={{
                                            color: "black",
                                            fontWeight: "bold"
                                        }}>{jobAd.recruiterName}</span></span> <br/>
                                    </div>

                                </div>
                                <div className="card-foot">
                                    <Link to={`/job-advertisements/${jobAd.id}`} className="card-button">Read
                                        more</Link>
                                </div>
                            </div>
                        </div>
                    ))}

            </div>
        </div>
    )
}