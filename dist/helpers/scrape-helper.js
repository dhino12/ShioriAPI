"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTextAfterLabel = getTextAfterLabel;
function getTextAfterLabel(container, label) {
    // Cari semua elemen dengan class "dark_text"
    const labelElements = Array.from(container.querySelectorAll(".dark_text"));
    // Cari elemen yang textContent-nya diawali label (misal "Genres:")
    const labelEl = labelElements.find(el => { var _a; return (_a = el.textContent) === null || _a === void 0 ? void 0 : _a.trim().startsWith(label); });
    if (!labelEl)
        return null;
    let value = "";
    let node = labelEl.nextSibling;
    while (node) {
        if (node.nodeType === 3) {
            // TEXT_NODE
            value += node.textContent;
        }
        if (node.nodeName === "BR")
            break; // berhenti kalau ketemu <br>
        node = node.nextSibling;
    }
    return value.replace(/\s+/g, "");
}
