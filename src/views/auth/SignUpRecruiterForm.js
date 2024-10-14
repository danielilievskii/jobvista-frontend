import {useDispatch} from "react-redux";
import {useNavigate} from "react-router";
import * as yup from "yup";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import {AuthActions} from "../../redux/actions/authActions";

export const SignUpRecruiterForm = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate()

    const schema = yup.object().shape({
        companyNameReg: yup.string().required("Company name is required."),
        phoneNumberReg: yup.string().required("Phone number is required"),
        companyEmailReg: yup.string().required("Email is required.").email("Email is not valid."),
        passwordReg: yup.string().min(6, "Password must be at least 6 characters.").required("Password is required."),
        confirmPasswordReg: yup.string().oneOf([yup.ref("passwordReg")], "Passwords are not same").required("Confirm your password."),
    });

    const {register, handleSubmit, formState: {errors}} = useForm({
        resolver: yupResolver(schema),
    });

    const signUp = async (values) => {
        try {
            dispatch(AuthActions.signUpRecruiter(values.companyNameReg, values.phoneNumberReg, values.companyEmailReg,
                values.passwordReg, success => {
                    // createSnackbar({
                    //     message: success ? 'Successfully signed up.' : 'Error while signing up. Try again!',
                    //     timeout: 2500,
                    //     theme: success ? 'success' : 'error'
                    // });
                    success && navigate("/no-access");
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
                        <h3 className="login-heading mb-4">Register as a Recruiter</h3>
                        <form onSubmit={handleSubmit(signUp)}>
                            <div className="form-floating mb-3">
                                <input type="text" className="form-control" {...register("companyNameReg")}
                                       placeholder="David"/>
                                <label htmlFor="floatingCompanyName">Company name</label>
                                <p className="error-message" >{errors.companyNameReg?.message}</p>
                            </div>
                            <div className="form-floating mb-3">
                                <input type="text" className="form-control" {...register("companyEmailReg")}
                                       placeholder="David"/>
                                <label htmlFor="floatingFirstName">Company email address</label>
                                <p className="error-message" >{errors.companyEmailReg?.message}</p>
                            </div>
                            <div className="form-floating mb-3">
                                <input type="text" className="form-control" {...register("phoneNumberReg")}
                                       placeholder="David"/>
                                <label htmlFor="floatingFirstName">Contact phone number</label>
                                <p className="error-message" >{errors.phoneNumberReg?.message}</p>
                            </div>
                            <div className="form-floating mb-3">
                                <input type="password" className="form-control" {...register("passwordReg")}
                                       placeholder="Password"/>
                                <label htmlFor="floatingPassword">Password</label>
                                <p className="error-message" >{errors.passwordReg?.message}</p>
                            </div>
                            <div className="form-floating mb-3">
                                <input type="password" className="form-control" {...register("confirmPasswordReg")}
                                       placeholder="Confirm Password"/>
                                <label htmlFor="floatingPassword">Confirm Password</label>
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