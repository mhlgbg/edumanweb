// config.js
let configData = null;

export async function loadConfig() {
    if (!configData) {
        const response = await fetch('/config.json');
        configData = await response.json();
    }
    return configData;
}

export function getConfig(key) {
    return configData ? configData[key] : '';
}
