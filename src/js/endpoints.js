const host = window.location.hostname === '127.0.0.1' || 'localhost' ? 'http://localhost:8080' : '';
const apiEndpoint = `https://api.airportels.ninja`;
const endpoints = {
    host,
    checkToken: `${apiEndpoint}/api/msd/authPing`,
    uploadEndpoint: `${apiEndpoint}/api/msd/delivery/uploadPOD`,
    searchParcelByPhone: `${host}/parcel`,
    searchParcelById: `${apiEndpoint}/api/waybill/detail`,
    requestOTPEndpoint: `${apiEndpoint}/api/msd/password/recover/requestOTP`,
    verifyOTPEndpoint: `${apiEndpoint}/api/msd/password/recover/verifyOTP`,
    changePasswordEndpoint: `${apiEndpoint}/api/msd/password/recover`,
    loginRequestOTPEndpoint: `${apiEndpoint}/api/msd/user/password/change/requestOTP`,
    loginVerifyOTPEndpoint: `${apiEndpoint}/api/msd/user/password/change/verifyOTP`,
    loginChangePasswordEndpoint: `${apiEndpoint}/api/msd/user/password/change`
}

export default endpoints;