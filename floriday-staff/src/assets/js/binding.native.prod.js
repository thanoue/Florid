function receiveEvent(data) {
    callAngularFunction(data);
}

function showAndroidToast(toast) {

    if (typeof Android !== "undefined" && Android !== null) {
        Android.showToast(toast);
    } else {
        console.log('error!!!!');
    }
}

function login(email, password) {
    if (typeof Android !== "undefined" && Android !== null) {
        Android.login(email, password);
    }
}

function insertData(data) {
    if (typeof Android !== "undefined" && Android !== null) {
        Android.insertData(JSON.stringify(data));
        return 1;
    }
    else {
        return -1;
    }
}

function insertDataWithIdResult(data) {
    if (typeof Android !== "undefined" && Android !== null) {
        return Android.insertWithIdResult(JSON.stringify(data));
    }
    else {
        return "not from android";
    }
}


function callAngularFunction(data) {
    window.angularComponentReference.zone.run(() => { window.angularComponentReference.loadAngularFunction(data); });
}

function getFirebaseConfig() {

    if (typeof Android !== "undefined" && Android !== null) {
        return JSON.parse(Android.getFirebaseConfig());
    }
    else
        return {
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

function showErrorDialog(title, content) {
    jQuery("#login").append("<div class='overlay-dark'></div>");
    jQuery("#loginerror").fadeIn(350);
    jQuery(".overlay-dark").click(function () {
        jQuery("#loginerror").hide(250);
        jQuery(this).remove();
    });
}