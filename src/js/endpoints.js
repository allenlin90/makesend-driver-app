const host = 'https://makesend-driver.herokuapp.com'
// const host = window.location.hostname === '127.0.0.1' || 'localhost' ? 'http://localhost:8080' : '';
const server = `asia`;
const apiEndpoint = `https://apiold.makesend.${server}`;
const appEndpoint = `https://app.makesend.${server}`;
const endpoints = {
    host,
    apiEndpoint,
    appEndpoint,
    driverList: `${host}/drivers`, // GET apikey
    driverLogin: `${host}/driverlogin`, // POST phone, dob, apikey
    searchParcelByPhone: `${host}/searchParcelByPhone`,
    searchParcelById: `${host}/searchParcelByTrackingId`,
    driverTasks: `${host}/sorting`, // this is for task list filter
    allParcels: `${apiEndpoint}/api/google/makesend/order/fetch`,
    checkToken: `${apiEndpoint}/api/msd/authPing`,
    uploadEndpoint: `${apiEndpoint}/api/msd/delivery/uploadPOD`,
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