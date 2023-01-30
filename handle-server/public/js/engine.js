"use strict";
class Html {
    static withoutEndTag(config) {
        return `<${config.tag}${config.id ? ` id = "${config.id}"` : ""}${config.style ? ` class = "${config.style}"` : ""}${config.class ? ` class = "${config.class}"` : ""}${config.type ? ` type = "${config.type}"` : ""}${config.value ? ` value = "${config.value}"` : ""}${config.onclick ? ` onclick = "${config.onclick}"` : ""}${config.src ? ` src = "${config.src}"` : ""}${config.alt ? ` alt = "${config.alt}"` : ""}/>`;
    }
    static withEndTag(config) {
        let replaceChars = { "\n": "<br />" };
        Object.keys(replaceChars).forEach(element => {
            config.data = config.data.replace(element, replaceChars[element]);
        });
        return `<${config.tag}${config.id ? ` id = "${config.id}"` : ""}${config.style ? ` class = "${config.style}"` : ""}${config.class ? ` class = "${config.class}"` : ""}${config.src ? ` src = "${config.src}"` : ""}${config.value ? ` value = "${config.value}"` : ""}${onclick ? ` onclick = "${onclick}"` : ""}${config.rel ? ` rel = "${config.rel}"` : ""}${config.href ? ` href = "${config.href}"` : ""}${onclick ? ` id = "${onclick}"` : ""}${config.alt ? ` alt = "${config.alt}"` : ""}>${config.data ? config.data : ""}</${config.tag}>`;
    }
    static elementTo(id, data) {
        var _a;
        (_a = document.getElementById(id)) === null || _a === void 0 ? void 0 : _a.innerHTML = data;
    }
    static appendTo(id, data) {
        var _a;
        (_a = document.getElementById(id)) === null || _a === void 0 ? void 0 : _a.innerHTML += data;
    }
}
