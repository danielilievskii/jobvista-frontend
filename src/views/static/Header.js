import {Link, NavLink} from "react-router-dom";
import "./Header.css"
import {jwtDecode} from "jwt-decode";
import {useDispatch, useSelector} from 'react-redux';
import {useEffect, useState} from "react";
import {AuthActions} from "../../redux/actions/authActions";
import Roles from "../../enumerations/Roles";
import {useNavigate} from "react-router";
import {AUTH_TOKEN} from "../../axios/axiosInstance";
import {JobSeekerActions} from "../../redux/actions/JobSeekerActions";
import {RecruiterActions} from "../../redux/actions/recruiterActions";

export const Header = (props) => {

    const auth = useSelector(state => state.auth.currentUser);
    const dispatch = useDispatch();
    const navigator = useNavigate();

    const [role, setRole] = useState("");
    const [username, setUsername] = useState("");
    const [user, setUser] = useState("");

    const [profilePics, setProfilePics] = useState({});
    let profilePicState = useSelector(state => state.images.profilePictures);
    const [profilePicDispatched, setProfilePicDispatched] = useState(false);

    const [logos, setLogos] = useState({});
    let logoState = useSelector(state => state.images.logos);
    const [logoDispatched, setLogoDispatched] = useState(false);

    const signOut = () => {
        dispatch(AuthActions.signOut());
        window.location = "/";
        //navigator("/")
    }
    const [isActive, setIsActive] = useState(false);

    const toggleMenu = () => {
        setIsActive(!isActive);
    };

    useEffect(() => {
        const token = localStorage.getItem(AUTH_TOKEN);
        if (token != null) {
            try {
                const decodedToken = jwtDecode(token);
                setUser({
                    name: decodedToken.name,
                    role: decodedToken.role,
                    hasAccess: decodedToken.hasAccess,
                    id: decodedToken.id
                });
            } catch (error) {
                console.error('Failed to decode token', error);
            }
        }
    }, [auth]);

    useEffect(() => {
        if (auth) {
            setRole(auth.role);
            setUsername(auth.name);

            console.log("ROLE: " + auth.role)

            if (auth.role === Roles.JOBSEEKER) {
                dispatch(JobSeekerActions.downloadProfilePic(auth.id, (success, reponse) => {
                    if (success) {
                        setProfilePics(prevState => ({...prevState, [auth.id]: reponse}))
                        console.log(reponse)
                    }
                }))
            } else if (auth.role === Roles.RECRUITER) {
                dispatch(RecruiterActions.downloadLogo(auth.id, (success, reponse) => {
                    if (success) {
                        setLogos(prevState => ({...prevState, [auth.id]: reponse}))
                        console.log(reponse)
                    }
                }))
            }
        }
    }, [auth]);

    return (
        <nav className="navbar navbar-expand-lg bg-light">
            <div className="container-fluid">
                <Link to="/" className="logo"/>
                <Link to="/" className="brand-name"/>
                <div className="navbar-collapse">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <NavLink to="/" className="nav-item nav-link">Home</NavLink>
                        {role == Roles.JOBSEEKER &&
                            <>
                                <NavLink to="/my-applications" className="nav-item nav-link">My Applications</NavLink>
                            </>
                        }
                        {role == Roles.RECRUITER &&
                            <>
                                <NavLink to="/job-management-hub" className="nav-item nav-link">Job Management Hub</NavLink>
                            </>
                        }
                        {role === Roles.ADMIN &&
                            <>
                                <NavLink to="/admin-panel" className="nav-item nav-link">Admin Panel</NavLink>
                            </>
                        }
                        <NavLink to="/about" className="nav-item nav-link">About Us</NavLink>
                        {/*<NavLink to="/contact" className="nav-item nav-link">Support</NavLink>*/}
                    </ul>
                </div>
                {(auth.role === Roles.RECRUITER || auth.role === Roles.ADMIN || auth.role === Roles.JOBSEEKER) ?
                    <>
                        <div className={`navigation ${isActive ? 'active' : ''}`}>
                            <div className="user-box">
                                <div className="image-box">
                                    {user.role === Roles.JOBSEEKER && <img src={profilePicState[auth.id]} /> }
                                    {user.role === Roles.RECRUITER && <img src={logoState[auth.id]} /> }
                                    {user.role === Roles.ADMIN && <img src="/images/admin.jpg"/> }
                                    {/*<img src="https://lh3.googleusercontent.com/a/ACg8ocJOmmRzyRWcuhJj_sCzIoxMeP1M1DOgQ1UeYsFoeJuFB4XgOAnS=s96-c"/>*/}
                                </div>
                                <div className="auth-box">
                                    <p className="username">{user.name}</p>
                                    {user.role === Roles.RECRUITER && <p className="role">Recruiter</p>}
                                    {user.role === Roles.JOBSEEKER && <p className="role">Job Seeker</p>}
                                    {user.role === Roles.ADMIN && <p className="role">Admin</p>}
                                </div>

                            </div>
                            <div className="menu-toggle" onClick={toggleMenu}></div>
                            <ul className="menu">
                                {user.role == Roles.JOBSEEKER &&
                                    <>
                                        <Link to="/job-seeker/edit-profile" onClick={toggleMenu} className="menu-link">
                                            <i className="fa-solid fa-pen-to-square"></i> Edit profile
                                        </Link>
                                    </>
                                }
                                {user.role == Roles.RECRUITER &&
                                    <>
                                        <Link to="/recruiter/edit-profile" onClick={toggleMenu} className="menu-link">
                                            <i className="fa-solid fa-pen-to-square"></i> Edit profile
                                        </Link>
                                    </>
                                }

                                <Link onClick={signOut} className="menu-link">
                                    <i className="fa-solid fa-right-from-bracket"></i> Log out
                                </Link>
                            </ul>
                        </div>
                    </> :
                    <>
                        <Link to="/signin" className="btn auth-secondary-btn">Sign in</Link>
                    </>
                }
            </div>
        </nav>

    )
}