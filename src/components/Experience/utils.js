import { useState, useEffect } from 'react';

/* -------------------------------------------Tiny JSON syntax highlighter (safe-ish)-------------------------------------------- */
export const highlightJson = (jsonString) => {
    const esc = jsonString.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    let h = esc.replace(/"([^"\\]|.)*"/g, (m) => `<span class="json-string">${m}</span>`);
    h = h.replace(/\b-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?\b/g, (m) => `<span class="json-number">${m}</span>`);
    h = h.replace(/(true|false|null)\b/g, (m) => `<span class="json-boolean-null">${m}</span>`);
    h = h.replace(/[{}]/g, (m) => `<span class="json-brace">${m}</span>`);
    h = h.replace(/[\[\]]/g, (m) => `<span class="json-bracket">${m}</span>`);
    h = h.replace(/,/g, (m) => `<span class="json-comma">${m}</span>`);
    h = h.replace(/"(\w+)":/g, (m, g1) => `<span class="json-key">"${g1}"</span>:`);
    return h;
};

/* ------------------------------------------- Local Storage Hook -------------------------------------------- */
export const useLocalStorage = (key, fallback) => {
    const [value, setValue] = useState(() => {
        try {
            const raw = localStorage.getItem(key);
            return raw ? JSON.parse(raw) : fallback;
        } catch {
            return fallback;
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error("Error saving to local storage:", error);
        }
    }, [key, value]);

    return [value, setValue];
};

/* ------------------------------------------- Window Positioning & Sizing Utilities -------------------------------------------- */
export const getSectionRect = (sectionRef) => sectionRef.current?.getBoundingClientRect() ?? { left: 0, top: 0, width: window.innerWidth, height: window.innerHeight };

export const clampPos = (x, y, w, h, secRect, PAD) => {
    const maxX = Math.max(0, secRect.width - w - PAD);
    const maxY = Math.max(PAD, secRect.height - h - PAD); // Ensure it's not off top

    return {
        x: Math.min(Math.max(x, PAD), maxX),
        y: Math.min(Math.max(y, PAD), maxY)
    };
};

export const clampSize = (w, h, x, y, secRect, MIN_W, MIN_H, PAD) => {
    const maxW = Math.max(MIN_W, secRect.width - x - PAD);
    const maxH = Math.max(MIN_H, secRect.height - y - PAD);

    return {
        w: Math.min(Math.max(w, MIN_W), maxW),
        h: Math.min(Math.max(h, MIN_H), maxH)
    };
};