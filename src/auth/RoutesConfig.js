import {Navigate, Route, Router, Routes} from 'react-router-dom'
import {Dashboard} from "../views/dashboard/Dashboard";
import {SignInForm} from "../views/auth/SignInForm";
import {SignUpRecruiterForm} from "../views/auth/SignUpRecruiterForm";
import {SignUpJobSeekerForm} from "../views/auth/SignUpJobSeekerForm";
import {Workspace} from "../views/job_advertisements/JobManagementHub";
import {JobAdDetails} from "../views/job_advertisements/JobAdDetails";
import {ApplicationsByJobAd} from "../views/applications/ApplicationsByJobAd";
import {ApplicationsByJobSeeker} from "../views/applications/ApplicationsByJobSeeker";

import {AdminPanel} from "../views/admin_panel/AdminPanel";
import {RecruiterProfile} from "../views/profiles/RecruiterProfile";
import {AboutUs} from "../views/static/AboutUs";
import {JobSeekerEditProfile} from "../views/profiles/JobSeekerEditProfile";
import {RecruiterEditProfile} from "../views/profiles/RecruiterEditProfile";
import Roles from "../enumerations/Roles";
import {useSelector} from "react-redux";
import {useEffect, useState} from "react";
import {ErrorPage} from "../views/static/ErrorPage";
import {NoAccess} from "../views/static/NoAccess";

export const PrivateRoutes = [
    {
        component: AdminPanel,
        path: '/admin-panel',
        title: 'Admin Panel',
        exact: true,
        permission: [
            Roles.ADMIN
        ]
    },
    {
        component: Workspace,
        path: '/job-management-hub',
        title: 'Job Management Hub',
        exact: true,
        permission: [
            Roles.RECRUITER,
        ]
    },
    {
        component: ApplicationsByJobAd,
        path: '/job-management-hub/applications/:advertisement_id',
        title: 'Applications by Job Ad',
        exact: true,
        permission: [
            Roles.RECRUITER
        ]
    },
    {
        component: ApplicationsByJobSeeker,
        path: '/my-applications',
        title: 'My Applications',
        exact: true,
        permission: [
            Roles.JOBSEEKER
        ]
    },

    {
        component: JobSeekerEditProfile,
        path: '/job-seeker/edit-profile',
        title: 'Edit Job Seeker Profile',
        exact: true,
        permission: [
            Roles.JOBSEEKER
        ]
    },
    {
        component: RecruiterEditProfile,
        path: '/recruiter/edit-profile',
        title: 'Edit Recruiter Profile',
        exact: true,
        permission: [
            Roles.RECRUITER
        ]
    },
]

export const PublicRoutes = [
    {
        component: Dashboard,
        path: "/",
        exact: true,
        permission: [
            Roles.RECRUITER,
            Roles.JOBSEEKER,
            Roles.ADMIN,
            Roles.GUEST
        ]
    },
    {
        component: SignInForm,
        path: '/signin',
        title: 'Sign In',
        exact: true,
        permission: [
            Roles.GUEST,
            Roles.RECRUITER,
            Roles.JOBSEEKER,
            Roles.ADMIN
        ]
    },

    {
        component: SignUpRecruiterForm,
        path: '/signup/recruiter',
        title: 'Sign Up as Recruiter',
        permission: [
            Roles.GUEST,
            Roles.RECRUITER,
            Roles.JOBSEEKER,
            Roles.ADMIN
        ]
    },
    {
        component: SignUpJobSeekerForm,
        path: '/signup/job-seeker',
        title: 'Sign Up as Job Seeker',
        permission: [
            Roles.GUEST,
            Roles.RECRUITER,
            Roles.JOBSEEKER,
            Roles.ADMIN
        ]
    },
    {
        component: JobAdDetails,
        path: '/job-advertisements/:id',
        title: 'Job Advertisement Details',
        exact: true,
        permission: [
            Roles.RECRUITER,
            Roles.JOBSEEKER,
            Roles.ADMIN,
            Roles.GUEST
        ]
    },
    {
        component: RecruiterProfile,
        path: '/recruiters/:id',
        title: 'Recruiter Profile',
        exact: true,
        permission: [
            Roles.RECRUITER,
            Roles.JOBSEEKER,
            Roles.ADMIN,
            Roles.GUEST
        ]
    },
    {
        component: AboutUs,
        path: '/about',
        title: 'About Us',
        exact: true,
        permission: [
            Roles.GUEST,
            Roles.RECRUITER,
            Roles.JOBSEEKER,
            Roles.ADMIN
        ]
    },
    {
        component: NoAccess,
        path: '/no-access',
        title: 'No Access',
        exact: true,
        permission: [
            Roles.GUEST,
            Roles.RECRUITER,
        ]
    },
]

const AllRoutes = [...PrivateRoutes, ...PublicRoutes];

const filterRoutes = (roleParam) => {
    return AllRoutes.filter(route => {
        return route.permission.includes(roleParam);
    });
};
const RoutesConfig = () => {
    const currentUser = useSelector(state => state.auth.currentUser);
    const [role, setRole] = useState(Roles.GUEST);

    useEffect(() => {
        if (currentUser) {
            setRole(currentUser.role);
        }
    }, [currentUser]);

    return (
        <Routes>
            {filterRoutes(role).map(route => (
                <Route
                    key={route.path}
                    path={route.path}
                    element={<route.component/>}
                    exact={route.exact}
                />
            ))}
            <Route path="*" element={<ErrorPage to="/"/>}/>
        </Routes>

        // <Routes>
        //     <Route path="/" element={<Dashboard/>}></Route>
        //     <Route path="/signin" element={<SignInForm/>}></Route>
        //     <Route path="/signup/recruiter" element={<SignUpRecruiterForm/>}></Route>
        //     <Route path="/signup/job-seeker" element={<SignUpJobSeekerForm/>}></Route>
        //     <Route path="/job-management-hub" element={<Workspace/>}></Route>
        //     <Route path="/my-applications" element={<ApplicationsByJobSeeker/>}></Route>
        //     <Route path="/job-advertisements/:id" element={<JobAdDetails/>}></Route>
        //     <Route path="/recruiters/:id" element={<RecruiterProfile/>}></Route>
        //     <Route path="/job-management-hub/applications/:advertisement_id" element={<ApplicationsByJobAd/>}></Route>
        //     <Route path="/admin-panel" element={<AdminPanel/>}></Route>
        //     <Route path="/about" element={<AboutUs/>}></Route>
        //     <Route path="/job-seeker/edit-profile" element={<JobSeekerEditProfile/>}></Route>
        //     <Route path="/recruiter/edit-profile" element={<RecruiterEditProfile/>}></Route>
        // </Routes>
    )
}

export default RoutesConfig