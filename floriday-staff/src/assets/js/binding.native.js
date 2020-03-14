function getFirebaseConfig() {
    if (typeof Android !== "undefined" && Android !== null) {
        return JSON.parse(Android.getFirebaseConfig());
    }
    else return {
        apiKey: 'AIzaSyDZGFKjLZH4h0SCRdmJVAP0QsRxo_9qYwA',
        authDomain: 'lorid-e9c34.firebaseapp.com',
        databaseURL: 'https://lorid-e9c34.firebaseio.com',
        projectId: 'lorid-e9c34',
        storageBucket: 'lorid-e9c34.appspot.com',
        messagingSenderId: '907493762076',
        appId: '1:907493762076:web:41a83454c12029c3c6abd9',
        measurementId: 'G-DMM406R71M'
    }
}

function login(email, password) {
    if (typeof Android !== "undefined" && Android !== null) {
        Android.login(email, password);
    }
}

function setStatusBarColor(isDark) {
    if (typeof Android !== "undefined" && Android !== null) {
        Android.setStatusBarColor(isDark);
    }
}

function doPrintJob(url) {
    if (typeof Android !== "undefined" && Android !== null) {
        Android.doPrintJob(url);
    }
}


function getInput(resCallback) {

    // if (typeof Android !== "undefined" && Android !== null) {
    //     Android.getInput(function (res) {
    //         resCallback(res);
    //     });
    // }
}

function getDateSelecting(year, month, day) {
    if (typeof Android !== "undefined" && Android !== null) {
        Android.requestDateSelecting(year, month, day);
    }
}

function setDate(year, month, day) {
    window.BaseReference.zone.run(() => { window.BaseReference.dateSelected(year, month, day); });
}

function getTimeSelecting(hour, minute) {
    if (typeof Android !== "undefined" && Android !== null) {
        Android.requestTimeSelecting(hour, minute);
    }
}

function setTime(hour, minute) {
    window.BaseReference.zone.run(() => { window.BaseReference.timeSelected(hour, minute); });
}

function getDateTimeSelecting(year, month, day, hour, minute) {
    if (typeof Android !== "undefined" && Android !== null) {
        Android.requestDateTimeSelecting(year, month, day, hour, minute);
    }
}


function setDateTime(year, month, day, hour, minute) {
    window.BaseReference.zone.run(() => { window.BaseReference.dateTimeSelected(year, month, day, hour, minute); });
}

function backNavigate() {
    window.BaseReference.zone.run(() => { window.BaseReference.forceBackNavigate(); });
}

function isOnTerminal() {
    if (typeof Android !== "undefined" && Android !== null) {
        return true;
    }
    else return false;
}


function getProductsFromCache(category) {

    if (typeof Android !== "undefined" && Android !== null) {
        return Android.getProductsFromCache(category);
    }
    else return 'NONE';
}

function addProductsToCache(products) {

    if (typeof Android !== "undefined" && Android !== null) {
        Android.addProductsToCache(JSON.stringify(products));
    }

    return;
}

function alert(message, alertType) {
    if (typeof Android !== "undefined" && Android !== null) {
        Android.alert(message, alertType);
    }

    return;
}

function pickFile() {
    if (typeof Android !== "undefined" && Android !== null) {
        Android.pickFile();
    }

    return;
}