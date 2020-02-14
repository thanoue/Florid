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