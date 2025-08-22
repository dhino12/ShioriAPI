export function capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * 
 * @param url https://yuucdn.com/wp-content/uploads/images/nade-nade-skill-de-maryoku-chuunyuu/chapter-01/1-68a7a7b1dadc8.jpg `link example`
 * @param reference_point chapter- `(titik acuan / reference_point)`
 * @param index 1 `(get string by index based on reference point)`
 * @returns nade-nade-skill-de-maryoku-chuunyuu
 */
export function extractTxTFromUrl(url: string|null, reference_point: string = "chapter-", index: number = 1): string | null {
    if (url == null || url == undefined) {return null}
    const parts = url.split("/");
    const chapterIndex = parts.findIndex((p) => p.startsWith(reference_point)); // Find the index of the reference point

    if (chapterIndex > 0) {
        return parts[chapterIndex - index]; // Get text before 'chapter-xx' or reference_point
    }

    return null; // Tidak ditemukan
}
