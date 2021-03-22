const host = 'https://makesend-driver.herokuapp.com'//window.location.hostname === '127.0.0.1' || 'localhost' ? 'http://localhost:8080' : '';
const server = `asia`;
const apiEndpoint = `https://api.airportels.${server}`;
const appEndpoint = `https://app.makesend.${server}`;
const endpoints = {
    host,
    apiEndpoint,
    appEndpoint,
    checkToken: `${apiEndpoint}/api/msd/authPing`,
    uploadEndpoint: `${apiEndpoint}/api/msd/delivery/uploadPOD`,
    searchParcelByPhone: `${host}/searchParcelByPhone`,
    searchParcelById: `${host}/searchParcelByTrackingId`,
    requestOTPEndpoint: `${apiEndpoint}/api/msd/password/recover/requestOTP`,
    verifyOTPEndpoint: `${apiEndpoint}/api/msd/password/recover/verifyOTP`,
    changePasswordEndpoint: `${apiEndpoint}/api/msd/password/recover`,
    loginRequestOTPEndpoint: `${apiEndpoint}/api/msd/user/password/change/requestOTP`,
    loginVerifyOTPEndpoint: `${apiEndpoint}/api/msd/user/password/change/verifyOTP`,
    loginChangePasswordEndpoint: `${apiEndpoint}/api/msd/user/password/change`,
    createPreprintIdEndpoint: `${apiEndpoint}/api/msd/qr/preprint/generate`,
    checkPreprintIdEndpoint: `${apiEndpoint}/api/msd/qr/preprint/check`,
    registerPreprintIdEndpoint: `${apiEndpoint}/api/msd/qr/preprint/register`,
}

export default endpoints;