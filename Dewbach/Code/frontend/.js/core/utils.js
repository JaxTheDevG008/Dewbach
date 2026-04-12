export const safeNumber = (value, fallback = 0) => {
    const num = Number(value);
    return Number.isFinite(num) ? num : fallback;
}

export const safeString = (value, fallback = "") => {
    if (typeof value !== "string") return fallback;
    return value.trim();
}

export const safeArray = (value, fallback = []) => {
    return Array.isArray(value) ? value : fallback;
}

export const safeJsonParse = (value, fallback = null) => {
    try {
        return JSON.parse(value);
    } catch {
        return fallback;
    }
}