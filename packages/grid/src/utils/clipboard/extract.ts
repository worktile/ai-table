export function extractText(text: string): string {
    if (!text) return '';

    // 如果文本包含HTML链接标签，提取链接文本
    if (text.includes('<a')) {
        const aTagMatch = text.match(/<a[^>]*>(.*?)<\/a>/i);
        if (aTagMatch?.[1]?.trim()) {
            return aTagMatch[1].trim();
        }
    }

    return text;
}

export function extractLinkUrl(text: string): string | null {
    if (!text) return null;

    // 1. 从HTML链接标签中提取URL，比如 https://mail.qq.com
    const hrefMatch = text.match(/href="([^"]+)"/);
    if (hrefMatch?.[1]) {
        return hrefMatch[1];
    }

    // 2. 匹配完整的URL（带协议），比如 https://mail.qq.com
    const protocolAndDomainMatch = text.match(/^(?:\w+:)?\/\/(\S+)$/);
    if (protocolAndDomainMatch?.[0]) {
        return protocolAndDomainMatch[0];
    }

    // 3. 匹配localhost格式，比如 localhost:6100
    const localhostDomainMatch = text.match(/^localhost[\:?\d]*(?:[^\:?\d]\S*)?$/);
    if (localhostDomainMatch?.[0]) {
        return `http://${localhostDomainMatch[0]}`;
    }

    // 4. 匹配普通域名，比如 www.baidu.com
    const ordinaryDomainMatch = text.match(/^[^\s\.]+\.\S{2,}$/);
    if (ordinaryDomainMatch?.[0]) {
        return `http://${ordinaryDomainMatch[0]}`;
    }

    return null;
}
