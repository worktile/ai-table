export const isWindowsOS = () => {
    const agent = navigator.userAgent.toLowerCase();
    if (agent.indexOf('win32') >= 0 || agent.indexOf('wow32') >= 0) {
        return true;
    }
    if (agent.indexOf('win64') >= 0 || agent.indexOf('wow64') >= 0) {
        return true;
    }
    return false;
};

export const isMac = () => {
    const agent = navigator.userAgent;
    return /macintosh/i.test(agent);
};
