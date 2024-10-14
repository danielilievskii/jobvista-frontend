

export const sortElementsBy = (array, column) => {
    return array.slice().sort((a, b) => {
        return new Date(b[column]).getTime() - new Date(a[column]).getTime()
    });
}

export const formatRelativeTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = now - date;

    const minute = 60 * 1000;
    const hour = minute * 60;
    const day = hour * 24;
    const week = day * 7;
    const month = day * 30;

    if (diffTime < minute) {
        return 'just now';
    } else if (diffTime < hour) {
        const minutes = Math.floor(diffTime / minute);
        return `${minutes} ${minutes === 1 ? 'min' : 'min'} ago`;
    } else if (diffTime < day) {
        const hours = Math.floor(diffTime / hour);
        return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
    } else if (diffTime < week) {
        const days = Math.floor(diffTime / day);
        return `${days} ${days === 1 ? 'day' : 'days'} ago`;
    } else if (diffTime < month) {
        const weeks = Math.floor(diffTime / week);
        return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`;
    } else {
        const months = Math.floor(diffTime / month);
        return `${months} ${months === 1 ? 'month' : 'months'} ago`;
    }
}