export function extractTextFromATag(text: string): string {
    let plainText = text;
    if (text.includes('<a')) {
        const aTagMatch = text.match(/<a[^>]*>(.*?)<\/a>/i);
        if (aTagMatch && aTagMatch[1] && aTagMatch[1].trim()) {
            plainText = aTagMatch[1];
        }
    }
    return plainText;
}

export function extractUrlFromATag(text: string): string | null {
    let href: string | null = null;
    const hrefMatch = text.match(/href="([^"]+)"/);
    if (hrefMatch && hrefMatch[1] && hrefMatch[1].trim()) {
        href = hrefMatch[1];
    }
    return href;
}
