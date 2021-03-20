import { userLogin } from './userLogin.js';
import { navigators } from './footer.js';
import { showheaders, hideHeaders } from './header.js';
import { checkToken } from './checkToken.js';
import { forgetPassword } from './forgetPassword.js';
import { searchFeatures } from './searchParcel.js';
import { qrScanner, stopStream } from './qrScanner.js';
import { userSetting } from './userSetting.js';
import { resetPassword, resetPasswordState } from './resetPassword.js';
import { userProfileSetting } from './userProfile.js';
import { aboutDriverApp } from './aboutSetting.js';

window.onload = async function () {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (token) {
        const validToken = await checkToken(token);
        if (validToken) {
            // window.location.hash = 'scanner';
            window.location.hash = 'search/phone';
            showheaders();
            // navigators('scanner');
            navigators('search');
            // qrScanner();
            searchFeatures();
        } else {
            userLogin();
        }
    } else {
        userLogin();
    }

    window.onhashchange = async function () {
        const hash = window.location.hash.toLowerCase();
        console.log(`path changes! ${hash}`);
        const validToken = await checkToken();
        stopStream();
        hideHeaders();
        resetPasswordState();
        if (validToken) {
            if (hash.includes(`#dashboard`)) {
                // window.location.hash = 'scanner';
                window.location.hash = 'search/phone';
            } else if (hash.includes(`#scanner`)) {
                navigators('scanner');
                qrScanner();
            } else if (hash.includes(`#search`)) {
                navigators('search');
                searchFeatures();
            } else if (hash.includes(`#tasks`)) {
                navigators('tasks');
            } else if (hash.includes(`#setting`)) {
                if (hash.includes(`userprofile`)) {
                    userProfileSetting();
                } else if (hash.includes(`resetpassword`)) {
                    resetPassword();
                } else if (hash.includes(`about`)) {
                    aboutDriverApp();
                } else {
                    navigators('setting');
                    userSetting();
                }
            } else {
                window.location.hash = '';
            }
        } else {
            switch (window.location.hash) {
                case '#forgetpassword':
                    forgetPassword();
                    break;
                default:
                    userLogin();
            }
        }
    }
}