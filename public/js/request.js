"use strict";
function sendRequest(method, url, body) {
    return new Promise((resolve, reject) => {
        let req = new XMLHttpRequest();
        req.onreadystatechange = () => {
            if (req.readyState == 4) {
                if (req.status >= 200 && req.status < 300) {
                    resolve(req.responseText);
                }
                else {
                    reject(req.responseText);
                }
            }
        };
        req.open(method, url);
        req.setRequestHeader("content-type", "application/x-www-form-urlencoded");
        req.send(body);
    });
}
