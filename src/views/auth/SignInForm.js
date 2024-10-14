import {Link} from "react-router-dom";
import "./auth.css"
import {useDispatch} from "react-redux";
import {useNavigate} from "react-router";
import * as yup from "yup";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import {AuthActions} from "../../redux/actions/authActions";
import {notifyIncorrectEmailOrPassword} from "../../utils/toastUtils";

import {GoogleOAuthProvider, GoogleLogin} from "@react-oauth/google";

export const SignInForm = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate()

    const schema = yup.object().shape({

        emailLog: yup.string().required("Email is required.").email("Email is not valid."),
        passwordLog: yup.string().min(3, "Password must be at least 6 characters.").required("Password is required."),

    });

    const {register, handleSubmit, formState: {errors}} = useForm({
        resolver: yupResolver(schema),
    });

    const signIn = async (values) => {
        try {
            dispatch(AuthActions.signIn(values.emailLog, values.passwordLog, success => {
                    if(success) {
                        navigate("/")
                    } else {
                        notifyIncorrectEmailOrPassword()
                    }
                }));
        } catch (err) {
            // console.error(err);
        }
    }

    const handleGoogleSuccess = (response) => {
        const tokenId = response.credential;

        dispatch(AuthActions.signInGoogle(tokenId, (success, error) => {
            if (success) {
                console.log("User signed in successfully");
                if(success) {
                    navigate("/")
                }
            } else {
                console.error("Google sign-in failed", error);
            }
        }));
    };

    const handleGoogleFailure = (error) => {
        console.error(error);
    };

    return (

        <div className="">
            <div className="container">
                <div className="row d-flex flex-column justify-content-center align-items-center">
                    <div className="col-md-8 form-container">
                        <h3 className="login-heading mb-4">Sign in</h3>
                        <form onSubmit={handleSubmit(signIn)}>
                            <div className="form-floating mb-3">
                                <input type="email" className="form-control" {...register("emailLog")}
                                       placeholder="name@example.com"/>
                                <label htmlFor="floatingEmail">Email address</label>
                            </div>
                            <div className="form-floating mb-3">
                                <input type="password" className="form-control" {...register("passwordLog")}
                                       placeholder="Password"/>
                                <label htmlFor="floatingPassword">Password</label>
                            </div>

                            <div className="form-check mb-3">
                                <input className="form-check-input" type="checkbox" value=""
                                       id="rememberPasswordCheck"/>
                                <label className="form-check-label" htmlFor="rememberPasswordCheck">
                                    Remember password
                                </label>
                            </div>

                            <div className="d-grid mb-3">
                                <button
                                    className="btn btn-lg auth-primary-btn text-uppercase fw-bold mb-2"
                                    type="submit">Sign in
                                </button>
                                {/*<div className="text-center">*/}
                                {/*    <a className="small" href="#">Forgot password?</a>*/}
                                {/*</div>*/}
                            </div>
                        </form>

                        <div className="or-thing">
                            <span>or</span>
                        </div>

                        <div className="row">
                            <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
                                <GoogleLogin
                                    onSuccess={handleGoogleSuccess}
                                    onError={handleGoogleFailure}
                                    type={"standard"}
                                    text={"signin_with"}
                                    locale={"en"}
                                    redirectUri="http://localhost:3000/login/oauth2/code/google"
                                />
                            </GoogleOAuthProvider>
                        </div>
                        <br/>
                    </div>

                    <div className="col-md-8 mt-5 form-container">
                        <div>
                            <h5 className="mb-3">Don't have an account?</h5>
                        </div>

                        <div className="row">
                            <div className="col-md-6">
                                <Link to="/signup/recruiter" className="btn auth-secondary-btn text-uppercase fw-bold mb-2 w-100">SIGN UP AS RECRUITER</Link>
                            </div>
                            <div className="col-md-6">
                                <Link to="/signup/job-seeker" className="btn auth-secondary-btn text-uppercase fw-bold mb-2 w-100">SIGN UP AS JOB SEEKER</Link>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}