import { userLogin } from './userLogin.js';
import { navigators } from './footer.js';
import { checkToken } from './checkToken.js';
import { searchFeatures } from './searchParcel.js';
import { qrScanner, stopStream } from './qrScanner.js';
window.onload = async function () {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (token) {
        const validToken = await checkToken(token);
        if (validToken) {
            window.location.hash = 'dashboard';
            navigators();
            searchFeatures();
        } else {
            userLogin();
        }
    } else {
        userLogin();
    }

    window.onhashchange = async function () {
        console.log('path changes!');
        const validToken = await checkToken();
        stopStream();
        if (validToken) {
            switch (window.location.hash) {
                case '#dashboard':
                    navigators();
                    searchFeatures();
                    break;
                case '#scanner':
                    navigators('scanner');
                    qrScanner();
                    break;
                case '#search':
                    navigators('search');
                    searchFeatures();
                    break;
                case '#tasks':
                    navigators('tasks');
                    break;
                case '#setting':
                    navigators('setting');
                    break;
                default:
                    window.location.hash = '';
            }
        } else {
            userLogin();
        }
    }
}