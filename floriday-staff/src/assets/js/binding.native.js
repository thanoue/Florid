var MyJSClient;
function showToast() {
    var txtVal = "toast from angular client";
    window.MyJSClient.getStringFromJS(txtVal);
}

function showToastWithCallback(callback) {
    var txtVal = "toast from angular client";
    window.MyJSClient.getStringFromJS(txtVal);
    callback();
}