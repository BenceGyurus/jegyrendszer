class Html{
    static withoutEndTag(config:any){
        return `<${config.tag}${config.id ? ` id = "${config.id}"` : ""}${config.class ? ` class = "${config.class}"` : ""}${config.type ? ` type = "${config.type}"` : ""}${config.value ? ` value = "${config.value}"` : ""}${config.onclick ? ` onclick = "${config.onclick}"` : ""}${config.src ? ` src = "${config.src}"` : ""}${config.alt ? ` alt = "${config.alt}"` : ""}/>`
    }
    static withEndTag(config:any){
        let replaceChars = {"\n" : "<br />"};
        Object.keys(replaceChars).forEach(element => {
            config.data = config.data.replace(element, replaceChars[element]);
        });
        return `<${config.tag}${config.id ? ` id = "${config.id}"` : ""}${config.class ? ` class = "${config.class}"` : ""}${config.src ? ` src = "${config.src}"` : ""}${config.value ? ` value = "${config.value}"` : ""}${onclick ? ` onclick = "${onclick}"` : ""}${config.rel ? ` rel = "${config.rel}"` : ""}${config.href ? ` href = "${config.href}"` : ""}${onclick ? ` id = "${onclick}"` : ""}${config.alt ? ` alt = "${config.alt}"` : ""}>${config.data ? config.data : ""}</${config.tag}>`
    }
    static elementTo(id:string, data:string){
        document.getElementById(id)?.innerHTML = data;
    }
    static appendTo(id:string, data:string){
        document.getElementById(id)?.innerHTML += data;
    }
}
