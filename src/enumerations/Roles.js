export const getRoleName = (role) => {
    switch (role) {
        case 'ROLE_ADMIN':
            return 'ADMIN';
        case 'ROLE_RECRUITER':
            return 'RECRUITER';
        case 'ROLE_JOBSEEKER':
            return 'JOBSEEKER';
    }
}

export default {
    ADMIN: 'ROLE_ADMIN',
    RECRUITER: 'ROLE_RECRUITER',
    JOBSEEKER: 'ROLE_JOBSEEKER',
    GUEST: 'ROLE_GUEST'
};