import { login } from './login.js';
import { navigators } from './footer.js';
import { showheaders, hideHeaders } from './header.js';
import { checkToken } from './checkToken.js';
import { forgetPassword } from './forgetPassword.js';
import { searchFeatures } from './searchParcel.js';
import { taskList } from './taskList.js';
import { qrScanner, stopStream } from './qrScanner.js';
import { userSetting } from './userSetting.js';
import { resetPassword, resetPasswordState } from './resetPassword.js';
import { userProfileSetting } from './userProfile.js';
import { aboutDriverApp } from './aboutSetting.js';
import { qrRegister } from './qrRegister.js';

window.onload = async function () {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (token) {
        const validToken = await checkToken(token);
        if (validToken) {
            window.location.hash = 'tasks';
            // window.location.hash = 'search/phone';
            showheaders();
            navigators('tasks');
            // navigators('search');
            taskList();
            // searchFeatures();
        } else {
            login();
        }
    } else {
        login();
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
                window.location.hash = 'tasks';
                // window.location.hash = 'search/phone';
            } else if (hash.includes(`#scanner`)) {
                navigators('scanner');
                qrScanner();
            } else if (hash.includes(`#search`)) {
                navigators('search');
                searchFeatures();
            } else if (hash.includes(`#tasks`)) {
                navigators('tasks');
                taskList();
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
            } else if (hash.includes(`#registerqr`)) {
                qrRegister();
            } else {
                window.location.hash = '';
            }
        } else {
            switch (window.location.hash) {
                case '#forgetpassword':
                    forgetPassword();
                    break;
                default:
                    login();
            }
        }
    }
}