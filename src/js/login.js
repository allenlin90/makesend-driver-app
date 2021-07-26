import { loginProcess } from './checkToken.js';
const container = document.querySelector('.container');

export function login() {
    sessionStorage.clear();
    localStorage.clear();
    window.location.hash = '';
    const yearOptions = createYearOptions(100);
    const monthOptions = createMonthOptions();
    
    container.innerHTML = `
        <div id="login_form">
            <div id="makesend_logo">
                <img src="https://www.makesend.asia/wp-content/uploads/2018/06/logo-makesend.png" alt="ms_logo">
            </div>
            <form action="" autocomplete="off">
                <div class="mb-3">
                    <label for="phone" class="form-label">Phone</label>
                    <input class="form-control" id="phone" type="tel" name="receiver_phone" value="" inputmode="numeric" placeholder="#0632166699" autocomplete="off" required">
                    <div class="invalid-feedback">Your phone is not correct</div>
                    </div>
                <div class="mb-3" style="display: flex; justify-content: space-between">
                    <select id="year_selector" required style="text-align-last: center">
                        ${yearOptions}
                    </select>
                    <select id="month_selector" required style="text-align-last: center">
                        ${monthOptions}
                    </select>
                    <select id="date_selector" required style="text-align-last: center">
                        <option disabled selected="true" value="">Select a Date<option>
                    </select>
                </div>
                <div id="birthday_error" class="invalid-feedback">Your birthday is not correct</div>
                <div class="mb-3 form-check">
                    <input type="checkbox" class="form-check-input" id="remember_me" checked>
                    <label class="form-check-label" for="remember_me">Remember me</label>
                </div>
                <button type="submit" class="btn btn-warning">Login</button>
            </form>
        </div>
    `;

    const loginForm = document.querySelector('#login_form');
    const userphoneInput = document.querySelector('#phone');
    const rememberMeInput = document.querySelector('#remember_me');
    const yearSelector = document.querySelector('#year_selector');
    const monthSelector = document.querySelector('#month_selector');
    const dateSelector = document.querySelector('#date_selector');
    const birthdayError = document.querySelector('#birthday_error');
    monthSelector.addEventListener('change', function(event) { createDateOptions(event, dateSelector) });
    
    userphoneInput.addEventListener('input', removeInvalidClass);
    yearSelector.addEventListener('change', removeInvalidClass);
    monthSelector.addEventListener('change', removeInvalidClass);
    dateSelector.addEventListener('change', removeInvalidClass);
    
    loginForm.addEventListener('submit', async function (event) {
        event.preventDefault();
        const userphone = userphoneInput.value;
        const userBirthYear = yearSelector.value;
        const userBirthMonth = monthSelector.value;
        const userBirthDate = dateSelector.value;
        if (!userphone || !userBirthYear || !userBirthMonth || !userBirthDate) {
            userphoneInput.classList.add('is-invalid');
            birthdayError.classList.add('d-block');
        } else {
            if (userphone && userBirthYear && userBirthMonth && userBirthDate) {
                const result = await loginProcess(userphone, userBirthYear, userBirthMonth, userBirthDate, rememberMeInput.checked);
                if (result) {
                    return;
                }
            }
            userphoneInput.classList.add('is-invalid');
            birthdayError.classList.add('d-block');
        }
    });

    function removeInvalidClass() {
        userphoneInput.classList.remove('is-invalid');
        birthdayError.classList.remove('d-block');
    };

    function createYearOptions(numYears = 100) {
        let now = new Date();
        let years = Array.from({ length:numYears },(v,k)=>k).reduce((list, num, index) => {
            const year = now.getFullYear() - index;
            let text = `<option value="${'' + year}">${year + 543}</option>`
            list += text;
            return list;
        }, '');
        years = `<option value="" selected="true" disabled>Select A Year</option>` + years;
        return years;
    }

    function createMonthOptions() {
        const monthArray = [
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December',
        ];
        let months = Array.from({length: 12}, (v, k) => (k + 1)).reduce((list, num, index) => {
            let number = 0;
            if (num < 10) {
                number = '0' + num;
            } else {
                number = '' + num;
            }
            let text = `<option value="${'' + number}">${monthArray[index]}</option>`
            list += text;
            return list;
        }, '');
        months = `<option value="" selected="true" disabled>Select A Month</option>` + months;
        return months;
    }

    function createDateOptions(event, node) {
        const monthValue = parseInt(event.target.value);
        let max = 0;
        switch(monthValue) {
            case 1:
            case 3:
            case 5:
            case 7:
            case 8:
            case 10:
            case 12:
                max = 31;
                break;
            case 4:
            case 6:
            case 9:
            case 11:
                max = 30;
                break;
            case 2:
                max = 29;
                break;
        }
        let dateOptions = Array.from({length: max}, (v, k) => k + 1).reduce((list, num, index) => {
            let number = 0;
            if (num < 10) {
                number = '0' + num;
            } else {
                number = '' + num;
            }
            let text = `<option value="${number}">${num}</option>`;
            list += text;
            return list;
        }, '');
        dateOptions = `<option disabled selected="true" value="">Select A Date</option>` + dateOptions;
        node.innerHTML = dateOptions;
    }
}