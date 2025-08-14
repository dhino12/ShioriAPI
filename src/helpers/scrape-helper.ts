export function getTextAfterLabel(container: Document, label: string) {
  // Cari semua elemen dengan class "dark_text"
    const labelElements = Array.from(container.querySelectorAll(".dark_text"));
    
    // Cari elemen yang textContent-nya diawali label (misal "Genres:")
    const labelEl = labelElements.find(el => el.textContent?.trim().startsWith(label));
    if (!labelEl) return null;

    let value = "";
    let node = labelEl.nextSibling;

    while (node) {
        if (node.nodeType === 3) { 
            // TEXT_NODE
            value += node.textContent;
        }
        if (node.nodeName === "BR") break; // berhenti kalau ketemu <br>
        node = node.nextSibling;
    }

    return value.replace(/\s+/g, "");
}