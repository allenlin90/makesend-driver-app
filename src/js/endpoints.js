const host = 'https://makesend-driver.herokuapp.com'//window.location.hostname === '127.0.0.1' || 'localhost' ? 'http://localhost:8080' : '';
const endpoints = {
    host,
    checkToken: 'https://api.airportels.ninja/api/msd/authPing'
}

export default endpoints;