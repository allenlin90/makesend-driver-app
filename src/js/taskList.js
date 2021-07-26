import { createSignaturePad } from './signaturePad.js';
import { createImageUploader } from './uploadImage.js';
import endpoints from './endpoints.js';
import { generateHeaders } from './checkToken.js';
const allParcelsEndpoint = `${endpoints.allParcels}`;
const driverTasksEndpoint = `${endpoints.driverTasks}`;

const state = {
    parcels: [],
    assignments: [],
    driverTasks: [],
    countTasks: 0,
    deliveringTasks: 0,
    deliveredTasks: 0,
    otherTasks: 0,
    showCount: 0,
    filteredDriverTasks: [],
    userId: ''
};

export const taskList = async () => {
    // set current user ID
    state.userId = localStorage.getItem('token');
    // state.userId = `60e189b2d1e7a00013affbf5`; // this is only for testing

    // set up header
    const header = document.querySelector('header');
    header.style.display = `block`;
    header.innerHTML = `
        <div id="header">Driver Tasks</div>
    `;

    // render loading spinner and start fetching data
    const container = document.querySelector('.container');
    container.style.justifyContent = `space-between`;
    container.innerHTML = `
    <div id="task_list">
        <div></div>
        <div></div>
        <div id="task_loader">
            <div class="spinner">
                <div class="spinner__ring spinner-border text-warning" role="status">
                    <span class="sr-only">Loading...</span>
                </div>
                <p class="spinner__text">Loading...</p>
            </div>
        </div>        
    </div>
    `;

    // fetch all required data
    state.parcels = await fetchAllParcels();
    state.assignments = await fetchAssignments();
    
    // filter and check tasks belong to driver user
    // state.driverTasks = [...state.parcels]; // this is for testing
    state.driverTasks = filterTasks(state);
    state.filteredDriverTasks = [...state.driverTasks];

    // create task content layout DOM
    // remove spinner after data is loaded
    document.querySelector('#task_list').innerHTML = `
    <div id="task_summary">
        <div>
            <div class="badge bg-secondary">Selected</div>
            <div id="show_count">${state.showCount}</div>
        </div>
        <div>
            <div>
                <div class="badge bg-primary">Delivering</div>
                <div>${state.deliveringTasks}</div>
            </div>
            <div>
                <div class="badge bg-success">Finished</div>
                <div>${state.deliveredTasks}</div>
            </div>
            <div>
                <div class="badge bg-warning">Others</div>
                <div>${state.otherTasks}</div>
            </div>
            <div>
                <div class="badge bg-secondary">Total</div>
                <div>${state.countTasks}</div>
            </div>
        </div>
    </div>
    <div id="task_filters"></div>
    <div id="task_results">
        <ul class="list-group list-group-flush"></ul>
    </div>
    `;

    // create task filters DOM
    document.querySelector('#task_filters').innerHTML = filterOptions();
    // set task filter event handler
    setupTaskFilters(state);

    // Render list of tasks
    listResults(state.driverTasks);
};

function filterTasks(state = null) {
    if (state) {
        const allTrackingId = state.assignments.parcelsToSort.filter(parcel => {
            return parcel[12] === state.userId;
        }).map(item => item[1]);
        let parcelsToRender = state.parcels.filter(parcel => allTrackingId.includes(parcel.trackingID));
        if (parcelsToRender.length !== allTrackingId.length) {
            // check if assigned tracking IDs match to filtred IDs
            // there may have manual orders which is put manually in sorting
            const missingIds = allTrackingId.filter(item => {
                return !parcelsToRender.map(parcel => parcel.trackingID).includes(item);
            });
            const missingTasksArray = state.assignments.shipmentList.filter(parcel => missingIds.includes(parcel[0]));
            const missingTasks = missingTasksArray.reduce((list, task) => {
                let parcel = {};
                for (let i = 0; i < state.assignments.shipmentListHeaders.length; i++) {
                    parcel[state.assignments.shipmentListHeaders[i]] = task[i];
                }
                list.push(parcel);
                return list;
            }, []);
            parcelsToRender = [...parcelsToRender, ...missingTasks];
        }

        // count tasks
        state.countTasks = allTrackingId.length;
        state.showCount = allTrackingId.length;
        state.deliveringTasks = parcelsToRender.filter(task => task.status.toLowerCase() === 'delivering').length;
        state.deliveredTasks = parcelsToRender.filter(task => task.status.toLowerCase() === 'delivered').length;
        state.otherTasks = state.countTasks - state.deliveringTasks - state.deliveredTasks;

        return parcelsToRender;
    }
    return [];
}

function filterOptions() {
    const filters = ['status'];
    const status = [
        {text: 'All', value: 'all'},
        {text: 'Delivering', value: 'delivering'},
        {text: 'Finished', value: 'delivered'},
        {text: 'Others', value: 'others'},
    ];
    const statusOptions = status.reduce((list, item) => {
        let option = `<option value="${item.value}">${item.text}</option>`
        list += option;
        return list;
    }, '');
    return  `
    <select id="filter_type">
        <option value="status">Delivery Status</option>
    </select>
    <select id="task_filter">
        ${statusOptions}
    </select>
    `;
}

function setupTaskFilters(state = null) {
    if (state) {
        // document.querySelector('#filter_type')

        // filter tasks by delivery status
        document.querySelector('#task_filter').addEventListener('change', function(event) {
            const selectedStatus = event.target.value;
            if (selectedStatus === 'all') {
                state.filteredDriverTasks = state.driverTasks;
            } else if (selectedStatus === 'others') {
                state.filteredDriverTasks = state.driverTasks.filter(task => task.status.toLowerCase() !== 'delivered' && task.status.toLowerCase() !== 'delivering' );
            } else {
                state.filteredDriverTasks = state.driverTasks.filter(task => task.status.toLowerCase() === selectedStatus.toLowerCase());
            }
            state.showCount = state.filteredDriverTasks.length;
            document.querySelector('#show_count').innerText = state.showCount;

            listResults(state.filteredDriverTasks);
        });
    }
}

async function fetchAssignments() {
    try {
        const response = await fetch(driverTasksEndpoint, {
            method: 'POST',
            mode: 'cors',
            headers: { 'content-type': 'application/json' },
        }).then(res => res.json());        
        return response;
    } catch (error) {
        console.log(error);
        alert(error)
        return [];
    }
};

async function fetchAllParcels() {
    try {
        const headers = await generateHeaders();
        const response = await fetch(allParcelsEndpoint, {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
                'User-Token': `${localStorage.getItem('token') || sessionStorage.getItem('token')}`,
                'Client-Token': headers['Client-Token'],
                'Time-Stamp': headers['Time-Stamp'],
                'Time-Signature': headers['Time-Signature']
            },
        }).then(res => res.json());
        if (response.resCode === 200) {
            return response.orderList;
        }
        return [];
    } catch (error) {
        alert(error);
        console.log(error);
        return [];
    }
}

function listResults(parcelList) {
    const tasks = parcelList.map(parcel => {
        if (/^[eE][xX]\d{13}/g.exec(parcel.trackingID)) {
            const item = `
            <li class="list-group-item">
                <div class="card" data-shipment-id="${parcel.trackingID}">
                    <div class="card-body">
                        <h5 class="card-title">Parcel ID: ${parcel.trackingID}</h5>
                        <h6 class="card-subtitle mb-2 text-muted">Service Date: ${parcel.orderDate}</h6>
                        <h6 class="card-subtitle mb-2 text-muted">Delivery Status: ${parcel.status}</h6>
                        <p class="card-text">Client:${parcel.receiverName}</p>
                        <p class="card-text">Phone:${parcel.receiverNo}</p>
                        <p class="card-text">Address: ${parcel.dropAddress}</p>
                        <p class="card-text">${parcel.dropDistrict}, ${parcel.dropProvince}, ${parcel.dropPostcode}</p>
                        <div>
                            ${showBtns(parcel.status.trim().toLowerCase(), parcel.trackingID)}
                        </div>
                    </div>
                </div>
            </li>
            `;
            return item;
        } 
    }).join('');
    document.querySelector('#task_results ul').innerHTML = tasks;
    const parcelCards = [...document.querySelector('.list-group.list-group-flush').children];
    parcelCards.forEach((parcelCard) => {
        const card = parcelCard.querySelector('.card');
        const uploadSignatureBtn = parcelCard.querySelector('div[data-type=signature]')
        uploadSignatureBtn.addEventListener('click', function (event) {
            event.preventDefault();
            event.stopPropagation();
            createSignaturePad(card.dataset.shipmentId);
        });

        const uploadImageBtn = parcelCard.querySelector('div[data-type=photo]');
        uploadImageBtn.addEventListener('click', function (event) {
            event.preventDefault();
            event.stopPropagation();
            createImageUploader(card.dataset.shipmentId);
        });
    });
}

function showBtns(status = '', trackingId = '') {
    if (trackingId) {
        let buttons = ``;
        let btnType = ``;
        let btnActive = ``;
        switch (status) {
            case 'pending':
            case 'in hub':
            case 'delivering':
            case 'delivering (delay)':
            case 'returning':
            case 're-deilvering':
                btnType = 'primary';
                break;
            case 'delivered':
            case 'delivered (delay)':
            case 'returned':
                btnType = 'primary';
                btnActive = 'disabled';
                break;
            case 'canceled':
            case 'failed delivery':
            case 'not found':
                btnType = 'danger';
                btnActive = 'disabled';
                break;
            default:
                btnType = 'primary';
        }
        buttons = `
        <div class="card-link btn btn-${btnType} ${btnActive}" data-type="photo">Photo</div>
        <div class="card-link btn btn-${btnType} ${btnActive}" data-type="signature">Singature</div>
        `;
        return buttons;
    }
    return null;
}