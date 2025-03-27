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

export const writeToClipboard = async (data: ClipboardContent) => {
    try {
        const { text, html } = data;
        if (isClipboardWriteSupported()) {
            const clipboardItem = new ClipboardItem({
                'text/plain': new Blob([text!], { type: 'text/plain' }),
                'text/html': new Blob([html!], { type: 'text/html' })
            });
            await navigator.clipboard.write([clipboardItem]);
        } else if (isClipboardWriteTextSupported()) {
            await navigator.clipboard.writeText(text!);
        } else {
            const textarea = document.createElement('textarea');
            textarea.value = text!;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
        }
    } catch (error) {
        console.warn('Failed to write clipboard:', error);
    }
};

export const readFromClipboard = async () => {
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
        } else if (isClipboardReadTextSupported()) {
            const clipboardText = await navigator.clipboard.readText();
            clipboardData.text = clipboardText;
        } else {
            const pastePromise = new Promise<ClipboardContent>((resolve) => {
                const textarea = document.createElement('textarea');
                document.body.appendChild(textarea);
                const handlePaste = (e: ClipboardEvent) => {
                    const text = e.clipboardData?.getData('text') || '';
                    const html = e.clipboardData?.getData('text/html') || '';

                    resolve({
                        text,
                        html: html || undefined
                    });

                    textarea.removeEventListener('paste', handlePaste);
                };
                textarea.addEventListener('paste', handlePaste);
                textarea.focus();
                document.execCommand('paste');
                document.body.removeChild(textarea);
            });
            clipboardData = await pastePromise;
        }
        return clipboardData;
    } catch (error) {
        console.warn('Failed to read clipboard:', error);
        return null;
    }
};
