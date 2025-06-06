
// credit: https://github.com/segmentio/is-url
// support mailto: protocol

const protocolAndDomainRE = /^(?:\w+:)?\/\/(\S+)$/;

const emailProtocolRE = /^mailto:([^\s@]+@[^\s@]+\.[^\s@]+)$/;

const localhostDomainRE = /^localhost[\:?\d]*(?:[^\:?\d]\S*)?$/;

const nonLocalhostDomainRE = /^[^\s\.]+\.\S{2,}$/;

/**
 * Loosely validate a URL `string`.
 */
export function isUrl(string: string) {
    if (typeof string !== 'string') {
        return false;
    }

    // 检查是否是 mailto: 协议
    var emailMatch = string.match(emailProtocolRE);
    if (emailMatch) {
        // 简单验证 email 地址格式
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailMatch[1]);
    }

    // 原有的 URL 验证逻辑
    var match = string.match(protocolAndDomainRE);
    if (!match) {
        return false;
    }

    var everythingAfterProtocol = match[1];
    if (!everythingAfterProtocol) {
        return false;
    }

    if (localhostDomainRE.test(everythingAfterProtocol) || nonLocalhostDomainRE.test(everythingAfterProtocol)) {
        return true;
    }

    return false;
}
