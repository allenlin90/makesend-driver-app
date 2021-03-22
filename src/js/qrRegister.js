import { registerPreprintId } from './trackingIdHandlers.js';
import { getParameterByName } from './helpers.js';

const state = {
    redirectCountdownTimer: null,
    id: '',
    trackingId: ''
}
// window.location.hash = '#registerqr?id=PP2103222259363&trackingId=EX2103211733231'; // valid IDs

export function qrRegister(id = null, trackingId = null) {
    const header = document.querySelector('header');
    header.style.display = `block`;
    header.innerHTML = `
        <div id="header">Register ID</div>
    `;
    const conatiner = document.querySelector('.container');
    conatiner.innerHTML = `
    <div id="register_qr">
        <div>
            <form action="" autocomplete="off">
                <div class="mb-3">
                    <label for="preprint_id_register" class="form-label">Prerint QR ID</label>
                    <input type="text" class="form-control" id="preprint_id_register" autocomplete="off"
                        placeholder="#PP0123456789012">
                    <div class="invalid-feedback">Preprint ID starts with "PP"</div>
                </div>
                <div class="mb-3">
                    <label for="tracking_id_register" class="form-label">Parcel Tracking ID</label>
                    <input type="text" class="form-control" id="tracking_id_register"
                        placeholder="#EX0123456789012">
                    <div class="invalid-feedback">Parcel Tracking ID starts with "EX"</div>
                </div>
                <button type="submit" class="btn btn-warning">Register Parcel ID</button>
            </form>
        </div>
    </div>
    `;
    state.id = getParameterByName('id') || id; // PP2103222259363
    state.trackingId = getParameterByName('trackingId') || trackingId; // EX2103211733231

    const preprintIdInput = document.querySelector('#preprint_id_register');
    const trackingIdInput = document.querySelector('#tracking_id_register');
    preprintIdInput.addEventListener('input', removeInvalidClass);
    trackingIdInput.addEventListener('input', removeInvalidClass);
    if (state.id) {
        preprintIdInput.value = state.id;
    }
    if (state.id) {
        trackingIdInput.value = state.trackingId;
    }

    const registerQRDiv = document.querySelector('#register_qr');
    const searchSettingForm = registerQRDiv.querySelector('form');
    searchSettingForm.onsubmit = mapIds;
}

async function mapIds(event) {
    event.preventDefault();
    const registerQRDiv = document.querySelector('#register_qr');
    const preprintIdInput = document.querySelector('#preprint_id_register');
    const trackingIdInput = document.querySelector('#tracking_id_register');
    state.id = preprintIdInput.value.trim().toLowerCase()
    const idToRegister = state.id;
    state.trackingId = trackingIdInput.value.trim().toLowerCase();
    const trackingIdToRegister = state.trackingId;
    registerQRDiv.innerHTML = loaderTag();
    if (/^p{2}\d{13}$/g.test(idToRegister) && /^ex\d{13}$/g.test(trackingIdToRegister)) {
        const response = await registerPreprintId(state.id, state.trackingId);
        console.log(response);
        if (response.resCode === 200) {
            registerQRDiv.innerHTML = successAnimation(3);
            redirectCountdown(3);
            window.location.hash = `search/trackingid?id=${state.trackingId}`;
        } else {
            console.log(response.message);
            alert(response.message);
            invalidForm();
        }
    } else {
        invalidForm();
    }
}

function invalidForm() {
    const registerQRDiv = document.querySelector('#register_qr');
    registerQRDiv.innerHTML = `
            <div>
                <form action="" autocomplete="off">
                    <div class="mb-3">
                        <label for="preprint_id_register" class="form-label">Prerint QR ID</label>
                        <input type="text" class="form-control" id="preprint_id_register" autocomplete="off"
                            placeholder="#PP0123456789012">
                        <div class="invalid-feedback">Preprint ID starts with "PP"</div>
                    </div>
                    <div class="mb-3">
                        <label for="tracking_id_register" class="form-label">Parcel Tracking ID</label>
                        <input type="text" class="form-control" id="tracking_id_register"
                            placeholder="#EX0123456789012">
                        <div class="invalid-feedback">Parcel Tracking ID starts with "EX"</div>
                    </div>
                    <button type="submit" class="btn btn-warning">Register Parcel ID</button>
                </form>
            </div>
            `;
    const preprintIdInput = document.querySelector('#preprint_id_register');
    const trackingIdInput = document.querySelector('#tracking_id_register');
    preprintIdInput.classList.add('is-invalid');
    trackingIdInput.classList.add('is-invalid');
    preprintIdInput.addEventListener('input', removeInvalidClass);
    trackingIdInput.addEventListener('input', removeInvalidClass);
    const searchSettingForm = document.querySelector('#register_qr form');
    searchSettingForm.onsubmit = mapIds;
}

function loaderTag() {
    return `
            <div id="loader">
                <div class="spinner-border text-warning" style="width:3rem; height:3rem;" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
                <h4>Loading...</h4>
            </div>
        `;
}

function successAnimation(duration = '10') {
    return `
            <div style="display: flex; flex-direction: column; justify-content: center; align-items: center;">
                <img style="display:block; width: 50%; border-radius: 10px;" src="https://i.pinimg.com/originals/e8/06/52/e80652af2c77e3a73858e16b2ffe5f9a.gif">
                <div>
                    <h2 style="text-align: center;">Success!</h2>
                </div>
                <div>
                    <p style="text-align: center;">Page redirect in <span id="redirect_countdown">${duration}</span> seconds...</p>
                </div>
            </div>
        `;
}

function redirectCountdown(duration = 10) {
    const redirect = document.querySelector('#redirect_countdown');
    if (duration > 0) {
        state.redirectCountdownTimer = setTimeout(function () {
            redirect.innerText = duration - 1;
            redirectCountdown(duration - 1)
        }, 1000);
    } else {
        if (state.redirectCountdownTimer) {
            clearTimeout(state.redirectCountdownTimer);
        }
    }
}

function removeInvalidClass() {
    if (this.id.includes('tracking_id')) {
        state.id = this.value;
    } else if (this.id.includes('preprint_id')) {
        state.trackingId = this.value;
    }
    const inputs = document.querySelectorAll('input');
    [...inputs].forEach(input => {
        input.classList.remove('is-invalid');
    });
}