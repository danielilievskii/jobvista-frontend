import "./NoAccess.css"
import {Link, NavLink} from "react-router-dom";
import {AuthActions} from "../../redux/actions/authActions";
import {useDispatch} from "react-redux";


export const NoAccess = (props) => {

    const dispatch = useDispatch();
    const signOut = () => {
        dispatch(AuthActions.signOut());
        window.location = "/";
    }

    return (
        <div className="d-flex align-items-center justify-content-center vh-100 landing-page">
            <div className="text-center">
                <p className="fs-3 fw-bold text-uppercase">Thank you for registering!</p>
                <p className="lead">
                    Your application has been received and is pending review. We will contact you soon for further authentication. <br/> Please check your email for updates.
                </p>
                {props.user && <button onClick={signOut} className="go-back-btn">Log out</button>}


            </div>
        </div>
    )
}