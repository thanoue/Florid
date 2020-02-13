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

function callAngularFunction(data) {
    window.angularComponentReference.zone.run(() => { window.angularComponentReference.loadAngularFunction(data); });
}  