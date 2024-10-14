
import * as yup from 'yup';
import {useDispatch} from "react-redux";
import {yupResolver} from "@hookform/resolvers/yup";
import {useForm} from "react-hook-form";
import {useNavigate} from 'react-router';
import "./auth.css"
import {AuthActions} from "../../redux/actions/authActions";

export const SignUpJobSeekerForm = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate()

    const schema = yup.object().shape({
        firstNameReg: yup.string().required("First name is required."),
        lastNameReg: yup.string().required("Last name is required."),
        phoneNumberReg: yup.string().required("Phone number is required"),
        emailReg: yup.string().required("Email is required.").email("Email is not valid."),
        passwordReg: yup.string().min(6, "Password must be at least 6 characters.").required("Password is required."),
        confirmPasswordReg: yup.string().oneOf([yup.ref("passwordReg")], "Passwords are not same").required("Confirm your password."),
    });

    const {register, handleSubmit, formState: {errors}} = useForm({
        resolver: yupResolver(schema),
    });

    const signUp = async (values) => {
        try {
            dispatch(AuthActions.signUpJobSeeker(values.firstNameReg, values.lastNameReg, values.phoneNumberReg, values.emailReg,
                values.passwordReg, success => {
                    // createSnackbar({
                    //     message: success ? 'Successfully signed up.' : 'Error while signing up. Try again!',
                    //     timeout: 2500,
                    //     theme: success ? 'success' : 'error'
                    // });
                    success && navigate("/");
                }));
        } catch (err) {
            console.error(err);
        }
    }


    return (
        <div className="d-flex align-items-center">
            <div className="container">
                <div className="row">
                    <div className="col-md-8 mx-auto form-container">
                        <h3 className="login-heading mb-4">Register as a Job Seeker</h3>
                        <form onSubmit={handleSubmit(signUp)}>
                            <div className="form-floating mb-1">
                                <input type="text" className="form-control" {...register("firstNameReg")} placeholder="Dwayne" />
                                <label htmlFor="firstName">First Name</label>
                                <p className="error-message" >{errors.firstNameReg?.message}</p>
                            </div>
                            <div className="form-floating mb-1">
                                <input type="text" className="form-control" {...register("lastNameReg")} placeholder="Johnson"/>
                                <label htmlFor="lastName">Last Name</label>
                                <p className="error-message" >{errors.lastNameReg?.message}</p>
                            </div>
                            <div className="form-floating mb-1">
                                <input type="text" className="form-control" placeholder="070479397" {...register("phoneNumberReg")} />
                                <label htmlFor="phoneNumber">Phone Number</label>
                                <p className="error-message" >{errors.phoneNumberReg?.message}</p>
                            </div>
                            <div className="form-floating mb-1">
                                <input type="email" className="form-control" placeholder="name@example.com" {...register("emailReg")}/>
                                <label htmlFor="email">Email Address</label>
                                <p className="error-message" >{errors.emailReg?.message}</p>
                            </div>
                            <div className="form-floating mb-3">
                                <input type="password" className="form-control" placeholder="Password" {...register("passwordReg")}/>
                                <label htmlFor="floatingPassword">Password</label>
                                <p className="error-message" >{errors.passwordReg?.message}</p>
                            </div>
                            <div className="form-floating mb-3">
                                <input type="password" className="form-control" placeholder="Confirm Password" {...register("confirmPasswordReg")}/>
                                <label htmlFor="floatingConfirmPassword">Confirm Password</label>
                                <p className="error-message" >{errors.confirmPasswordReg?.message}</p>
                            </div>

                            <div className="d-grid mb-3">
                                <button
                                    className="btn btn-lg auth-primary-btn text-uppercase fw-bold mb-2"
                                    type="submit">Submit
                                </button>
                            </div>
                        </form>

                    </div>
                </div>
            </div>
        </div>
    )
}