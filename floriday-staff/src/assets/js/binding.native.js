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
    window.angularComponentReference.zone.run(() => { window.angularComponentReference.dateSelected(year, month, day); });
}

function getTimeSelecting(hour, minute) {
    if (typeof Android !== "undefined" && Android !== null) {
        Android.requestTimeSelecting(hour, minute);
    }
}

function setTime(hour, minute) {
    window.angularComponentReference.zone.run(() => { window.angularComponentReference.timeSelected(hour, minute); });
}

function isOnTerminal() {
    if (typeof Android !== "undefined" && Android !== null) {
        return true;
    }
    else return false;
}


