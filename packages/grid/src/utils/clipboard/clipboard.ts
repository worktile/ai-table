import { ClipboardContent } from '../../types';

export const isClipboardWriteSupported = () => {
    return 'clipboard' in navigator && 'write' in navigator.clipboard;
};

export const isClipboardWriteTextSupported = () => {
    return 'clipboard' in navigator && 'writeText' in navigator.clipboard;
};

export const isClipboardReadSupported = () => {
    return 'clipboard' in navigator && 'read' in navigator.clipboard;
};

export const isClipboardReadTextSupported = () => {
    return 'clipboard' in navigator && 'readText' in navigator.clipboard;
};

export const writeToClipboard = async (data: ClipboardContent, dataTransfer?: DataTransfer | null) => {
    try {
        const { text, html } = data;
        if (isClipboardWriteSupported()) {
            const clipboardItem = new ClipboardItem({
                'text/plain': new Blob([text!], { type: 'text/plain' }),
                'text/html': new Blob([html!], { type: 'text/html' })
            });
            await navigator.clipboard.write([clipboardItem]);
            return;
        }

        if (dataTransfer) {
            dataTransfer.setData(`text/html`, html!);
            dataTransfer.setData(`text/plain`, text!);
            return;
        }

        if (isClipboardWriteTextSupported()) {
            await navigator.clipboard.writeText(text!);
            return;
        }
    } catch (error) {
        console.warn('Failed to write clipboard:', error);
    }
};

export const readFromClipboard = async (dataTransfer?: DataTransfer | null) => {
    try {
        let clipboardData: ClipboardContent = {};

        if (isClipboardReadSupported()) {
            const clipboardItems = await navigator.clipboard.read();
            if (Array.isArray(clipboardItems) && clipboardItems[0] instanceof ClipboardItem) {
                for (const item of clipboardItems) {
                    if (item.types.includes('text/html')) {
                        const blob = await item.getType('text/html');
                        clipboardData.html = await blob.text();
                    }
                    if (item.types.includes('text/plain')) {
                        const blob = await item.getType('text/plain');
                        clipboardData.text = await blob.text();
                    }
                }
            }

            const { html, text } = clipboardData;
            return html || text ? clipboardData : null;
        }

        if (dataTransfer) {
            const html = dataTransfer.getData(`text/html`);
            const text = dataTransfer.getData(`text/plain`);
            html && (clipboardData.html = html);
            text && (clipboardData.text = text);
            return html || text ? clipboardData : null;
        }

        if (isClipboardReadTextSupported()) {
            const text = await navigator.clipboard.readText();
            text && (clipboardData.text = text);
            return text ? clipboardData : null;
        }

        return null;
    } catch (error) {
        console.warn('Failed to read clipboard:', error);
        return null;
    }
};
