import endpoints from './endpoints.js';
const headerEndpoint = `${endpoints.host}/header`;
const loginEndpoint = `${endpoints.host}/login`;
const authCheckEndpoint = endpoints.checkToken;

export async function generateHeaders() {
    try {
        const response = await fetch(headerEndpoint, {
            method: 'post',
            mod: 'cors',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => res.json()).then(data => data);
        return response;
    } catch (err) {
        console.log(err);
        return null;
    }
}

export function userToken() {
    const token = sessionStorage.getItem('token') || localStorage.getItem('token') || null;
    return token;
}

export async function checkToken() {
    let validation = false;
    const token = userToken();
    const headers = await generateHeaders();
    if (token) {
        const response = await fetch(authCheckEndpoint, {
            method: 'post',
            mod: 'cors',
            responseType: 'json',
            headers: {
                'Content-Type': 'application/json',
                'User-Token': `${token}`,
                'Client-Token': headers['Client-Token'],
                'Time-Stamp': headers['Time-Stamp'],
                'Time-Signature': headers['Time-Signature']
            }
        })
            .then(res => res.json())
            .then(data => data)
            .catch(err => console.log(err));
        if (response.resCode === 200) {
            validation = true;
        }
    }
    return validation;
}

export async function loginProcess(email = '', password = '', rememberMe = false) {
    let headers = await generateHeaders();
    const response = await fetch(loginEndpoint, {
        method: 'post',
        headers: {
            'Content-type': 'application/json',
            'Client-Token': headers['Client-Token'],
            'Time-Stamp': headers['Time-Stamp'],
            'Time-Signature': headers['Time-Signature']
        },
        body: JSON.stringify({
            email,
            password,
            keepAlive: (rememberMe ? 1 : 0)
        })
    })
        .then(res => res.json())
        .then(data => data)
        .catch(err => err);
    if (response.resCode === 200) {
        if (rememberMe) {
            localStorage.setItem('token', response.token);
        } else {
            sessionStorage.setItem('token', response.token);
        }
        window.location.hash = 'dashboard';
        return true;
    }
    return false;
}