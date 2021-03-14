import { handleSubmitEvent, handleInputEvent } from './searchFunctions.js';

export function searchFeatures() {
    const container = document.querySelector('.container');
    container.style.justifyContent = `space-between`;
    container.innerHTML = `
    <div id="search_parcel">
        <div id="search_functions">
            <div id="search_by_phone_btn" class="btn btn-warning">Receiver Phone</div>
            <div id="search_by_tracking_id_btn" class="btn btn-dark">Tracking ID</div>
        </div>
        <div id="search_list">
            <div id="search_bar">
                <form action="">
                    <input class="form-control" id="receiver_phone" type="tel" name="receiver_phone" value=""
                        inputmode="numeric" placeholder="E.g. 0632166699" autocomplete="off" pattern="[0-9]{10}">
                    <button type="submit"><i class="fa fa-search"></i></button>
                </form>
            </div>            
            <div id="result_list">
                <ul class="list-group list-group-flush">
                    <li class="list-group-item">Please search parcel by <br> <b>Receiver Phone</b> or <br> <b>Tracking ID</b></li>
                </ul>
            </div>
        </div>
    </div>
    `;
    handleSubmitEvent();
    handleInputEvent();
    const searchByPhoneBtn = document.querySelector('#search_by_phone_btn');
    const searchByTrackingIdBtn = document.querySelector('#search_by_tracking_id_btn');
    const searchBar = document.querySelector('#search_bar');

    const searchInputByTrackingId = `
    <form action="" class="form-group">
        <input class="form-control" id="tracking_id" type="text" name="tracking_id" value=""
            placeholder="#EX1234567890123" autocomplete="off">
        <button type="submit"><i class="fa fa-search"></i></button>        
    </form>
    `;

    const searchInputByPhone = `
    <form action="">
        <input class="form-control" id="receiver_phone" type="tel" name="receiver_phone" value=""
            inputmode="numeric" placeholder="E.g. 0632166699" autocomplete="off" pattern="[0-9]{10}">
        <button type="submit"><i class="fa fa-search"></i></button>
    </form>
    `;

    searchByPhoneBtn.addEventListener('click', addSearchInput);
    searchByTrackingIdBtn.addEventListener('click', addSearchInput);

    function addSearchInput(event) {
        event.stopPropagation();
        const buttons = [...this.parentNode.children];
        buttons.forEach(btn => {
            if (btn === this) {
                btn.classList.add('btn-warning');
                btn.classList.remove('btn-dark');
            } else {
                btn.classList.add('btn-dark');
                btn.classList.remove('btn-warning');
            }
        });
        if (this.id === 'search_by_tracking_id_btn') {
            searchBar.innerHTML = searchInputByTrackingId;
        } else if (this.id === 'search_by_phone_btn') {
            searchBar.innerHTML = searchInputByPhone;
        }
        document.querySelector('#result_list ul').innerHTML = `<li class="list-group-item">Please search parcel by <br> <b>Receiver Phone</b> or <br> <b>Tracking ID</b></li>`;
        handleSubmitEvent();
        handleInputEvent();
    }
}