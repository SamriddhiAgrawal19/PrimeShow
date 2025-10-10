const dateFormat = (date) =>{
    return new Date(date).toLocaleDateString('en-GB', {
        weekday: 'short',
        month : 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric'
        // year: 'numeric'
    });
}
export default dateFormat;