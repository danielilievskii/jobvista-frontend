import "./AdminPanel.css"

import {useDispatch, useSelector} from "react-redux";
import {useState, useEffect} from "react";
import {AdminActions} from "../../redux/actions/adminActions";
import {notifyAccessUpdate} from "../../utils/toastUtils";

export const AdminPanel = () => {

    const dispatch = useDispatch();
    const [recruiters, setRecruiters] = useState([]);
    let recruitersState = useSelector(state => state.admin.recruiters)
    const [dispatched, setDispatched] = useState(false)

    useEffect(() => {
        if(!dispatched && recruitersState.length == 0) {
            dispatch(AdminActions.fetchRecruiters((success, response) => {
                if(success && response.data.length > 0) {
                    setRecruiters(response.data)
                }
                setDispatched(true)
                console.log("Fetch all recruiters GET")
            }))
        } else {
            setRecruiters(recruitersState)
            console.log("Fetch all recruiters STATE")
            console.log(recruitersState)

        }
    }, [recruitersState])

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };

    const handleAccessChange = (recruiterId, companyName, newAccessStatus) => {

        setRecruiters(prevState =>
            prevState.map(recruiter =>
                recruiter.id === recruiterId
                    ? { ...recruiter, hasAccess: newAccessStatus }
                    : recruiter
            )
        );

        dispatch(AdminActions.changeAccess(recruiterId, newAccessStatus, (success, response) => {
            if(success) {
                notifyAccessUpdate(companyName)
            }
        }));
    };

    return (
        <div className="custom-container mt-5">
            <table className="table">
                <thead>
                <tr>
                    <th scope="col">ID</th>
                    <th scope="col">Registered on</th>
                    <th scope="col">Email</th>
                    <th scope="col">Company Name</th>
                    <th scope="col">Phone Number</th>
                    <th scope="col">Access</th>
                </tr>
                </thead>
                <tbody>
                {recruitersState.map((recruiter) => (
                    <tr key={recruiter.id}>
                        <th scope="row">{recruiter.id}</th>
                        <td>{formatDate(recruiter.registeredOn)}</td>
                        <td>{recruiter.email}</td>
                        <td>{recruiter.companyName}</td>
                        <td>{recruiter.contactPhoneNumber}</td>
                        <td>
                            <label className="switch">
                                <input
                                    type="checkbox"
                                    checked={recruiter.hasAccess}
                                    onChange={(e) => handleAccessChange(recruiter.id, recruiter.companyName, e.target.checked)}
                                />
                                <span className="slider"></span>
                            </label>
                        </td>


                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    )
}