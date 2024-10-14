import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export const notifyProfileEdit = () => {
    toast.success(
        <span>
            Your details were successfully updated!
        </span>, {
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
            theme: "dark",
            pauseOnFocusLoss: false
        });
}

export const notifyProfilePicChange = () => {
    toast.success(
        <span>
            Your profile picture was successfully changed!
        </span>, {
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
            theme: "dark",
            pauseOnFocusLoss: false
        });
}

export const notifyLogoChange = () => {
    toast.success(
        <span>
            Your logo was successfully changed!
        </span>, {
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
            theme: "dark",
            pauseOnFocusLoss: false
        });
}

export const notifyJobAdEdit = () => {
    toast.success(
        <span>
            Job advertisement updated successfully!
        </span>, {
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
            theme: "dark",
            pauseOnFocusLoss: false
        });
}

export const notifyJobAdPost = () => {
    toast.success(
        <span>
            Job advertisement posted successfully!
        </span>, {
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
            theme: "dark",
            pauseOnFocusLoss: false
        });
}

export const notifyJobAdDelete = () => {
    toast.success(
        <span>
            Job advertisement deleted successfully!
        </span>, {
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
            theme: "dark",
            pauseOnFocusLoss: false
        });
}

export const notifyAppStatusUpdate = () => {
    toast.success(
        <span>
            Application/s updated successfully!
        </span>, {
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
            theme: "dark",
            pauseOnFocusLoss: false
        });
}

export const notifyJobAdApply = () => {
    toast.success(
        <span>
            Your application was successfully sent!
        </span>, {
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
            theme: "dark",
            pauseOnFocusLoss: false
        });
}

export const notifyJobAdUpdate= () => {
    toast.success(
        <span>
            Your application was successfully updated!
        </span>, {
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
            theme: "dark",
            pauseOnFocusLoss: false
        });
}

export const notifyAccessUpdate = (companyName) => {
    toast.success(
        <span>
            {companyName}'s access was successfully changed!
        </span>, {
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
            theme: "dark",
            pauseOnFocusLoss: false
        });
}

export const notifyIncorrectEmailOrPassword = () => {
    toast.error(
        <span>Incorrect email or password. Please try again.</span>,
        {
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
            theme: "dark",
            pauseOnFocusLoss: false
        }
    );
}