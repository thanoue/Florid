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

function callAngularFunction(data) {
    window.angularComponentReference.zone.run(() => { window.angularComponentReference.loadAngularFunction(data); });
}

