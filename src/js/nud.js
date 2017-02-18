
function nudUp(controlId, max, callback) {
    var ctl = document.getElementById(controlId);
    if (ctl && parseInt(ctl.innerHTML, 10) < max) {
        ctl.innerHTML = ((parseInt(ctl.innerHTML, 10) + 1) < 10 ? '0' : '') + (parseInt(ctl.innerHTML, 10) + 1);
        if (callback)
            callback(parseInt(ctl.innerHTML, 10));
    }
}

function nudDown(controlId, min, callback) {
    var ctl = document.getElementById(controlId);
    if (ctl && parseInt(ctl.innerHTML, 10) > min) {
        ctl.innerHTML = ((parseInt(ctl.innerHTML, 10) - 1) < 10 ? '0' : '') + (parseInt(ctl.innerHTML, 10) - 1);
        if (callback)
            callback(parseInt(ctl.innerHTML, 10));
    }
}
