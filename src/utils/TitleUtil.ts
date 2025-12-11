export function showTilte(){
    let e = window.event || arguments.callee.caller.arguments[0];
    e.preventDefault();
    e.stopPropagation();

    if(!e.target.dataset || !e.target.dataset.title || e.target.dataset.title.length === 0){
        if(window.textDiv){
            document.body.removeChild(window.textDiv)
            window.textDiv = null
        }
        return;
    }
    let text = e.target.dataset.title;
    if(!window.textDiv){
        window.textDiv = document.createElement('div');
        window.textDiv.setAttribute('style','padding: 20px;\n' +
            '  z-index: 10000;\n' +
            '  border-radius: 5px;\n' +
            '  color: white;\n' +
            '  position: absolute;\n' +
            '  font-size: 36px;\n' +
            '  background: rgba(5, 19, 43, 0.99);\n' +
            '  box-shadow: 0px 0px 16px 0px rgba(39, 168, 226, 0.27);\n' +
            '  border-radius: 4px;\n' +
            '  border: 2px solid #5CBCFF;\n' +
            '  max-width: 1600px;\n' +
            '  word-break:break-all;\n' +
            '  white-space: normal;');
    }
    window.textDiv.innerText = text;
    window.textDiv.style.left = e.clientX + 30 +'px';
    window.textDiv.style.top = e.clientY  + 20 +'px';
    document.body.append(window.textDiv)
}

export function hideTitle(){
    if(window.textDiv){
        document.body.removeChild(window.textDiv)
        window.textDiv = null
    }
}

export function ellipsis(value, len){
    const nums = len || "10"; //设置限定字数,默认为10
    if (!value) return "";
    if (value.length > nums) {
        return value.slice(0, nums) + "...";
    }
    return value;
}
