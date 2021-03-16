const host = 'https://makesend-driver.herokuapp.com'//window.location.hostname === '127.0.0.1' || 'localhost' ? 'http://localhost:8080' : '';
const apiEndpoint = `https://api.airportels.asia`;
const endpoints = {
    host,
    checkToken: `${apiEndpoint}/api/msd/authPing`,
    uploadEndpoint: `${apiEndpoint}/api/msd/delivery/uploadPOD`,
    searchParcelByPhone: `${host}/parcel`,
    searchParcelById: `${apiEndpoint}/api/waybill/detail`
}

export default endpoints;