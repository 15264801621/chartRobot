
function $(selector) {
    return document.querySelector(selector);
}

function $$(selector) {
    return document.querySelectorAll(selector)
}

// 创建元素
function $$$(tagName) {
    return document.createElement(tagName);
}