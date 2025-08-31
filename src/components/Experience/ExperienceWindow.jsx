import React, { useRef, useEffect } from 'react';
import JsonViz from './JsonViz.jsx';
import { getSectionRect, clampPos, clampSize } from './utils.js';

const ExperienceWindow = ({
                              sectionRef,
                              winPos,
                              setWinPos,
                              winSize,
                              setWinSize,
                              activeData,
                              setShowPreview,
                              setActiveData,
                              MIN_W,
                              MIN_H,
                              PAD
                          }) => {
    const windowRef = useRef(null);
    const dragRef = useRef({ dragging: false, offX: 0, offY: 0 });
    const resizeRef = useRef({ resizing: false, startX: 0, startY: 0, startW: 0, startH: 0 });


    const handleMaximize = (e) => {
        e.stopPropagation();
        maximizeToViewport();
    };

    // Helper: maximize to center of viewport
    const maximizeToViewport = () => {
        const isMobile = window.innerWidth < 768;
        const initialW = isMobile ? Math.round(window.innerWidth * 0.95) : 800;
        const initialH = isMobile ? Math.round(window.innerHeight * 0.7) : 480;
        const sec = getSectionRect(sectionRef);
        const { w, h } = clampSize(initialW, initialH, 0, 0, sec, MIN_W, MIN_H, PAD);
        const scrollY = window.scrollY || window.pageYOffset;
        const viewportH = window.innerHeight;
        const viewportW = window.innerWidth;
        const secRect = sectionRef.current?.getBoundingClientRect() || { top: 0, height: sec.height };
        const secTop = secRect.top + scrollY;
        const centerY = Math.max(scrollY, secTop) + Math.min(viewportH, secRect.height) / 2 - h / 2 - secTop;
        const centerX = (viewportW - w) / 2;
        const { x, y } = clampPos(centerX, centerY, w, h, sec, PAD);
        setWinPos({ x, y });
        setWinSize({ w, h });
    };

    // On mobile, only on first render: set position as if maximized
    useEffect(() => {
        const isMobile = window.innerWidth < 768;
        if (isMobile) {
            maximizeToViewport();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const startDrag = (e) => {
        if (!sectionRef.current) return;
        const sec = getSectionRect(sectionRef);
        const pageX = e.pageX ?? (e.clientX + window.scrollX);
        const pageY = e.pageY ?? (e.clientY + window.scrollY);
        const localX = pageX - (sec.left + window.scrollX);
        const localY = pageY - (sec.top + window.scrollY);

        dragRef.current.dragging = true;
        dragRef.current.offX = localX - winPos.x;
        dragRef.current.offY = localY - winPos.y;
        document.body.style.userSelect = 'none';
        document.body.style.cursor = 'grabbing';
    };

    const startResize = (e) => {
        if (!sectionRef.current) return;
        e.stopPropagation();
        const sec = getSectionRect(sectionRef);
        const pageX = e.pageX ?? (e.clientX + window.scrollX);
        const pageY = e.pageY ?? (e.clientY + window.scrollY);
        const localX = pageX - (sec.left + window.scrollX);
        const localY = pageY - (sec.top + window.scrollY);

        resizeRef.current.resizing = true;
        resizeRef.current.startX = localX;
        resizeRef.current.startY = localY;
        resizeRef.current.startW = winSize.w;
        resizeRef.current.startH = winSize.h;
        document.body.style.userSelect = 'none';
        document.body.style.cursor = 'se-resize';
    };

    useEffect(() => {
        const onMove = (e) => {
            if (!sectionRef.current) return;
            const sec = getSectionRect(sectionRef);
            const pageX = e.pageX ?? (e.clientX + window.scrollX);
            const pageY = e.pageY ?? (e.clientY + window.scrollY);

            // convert to section-local
            const localX = pageX - (sec.left + window.scrollX);
            const localY = pageY - (sec.top + window.scrollY);

            if (dragRef.current.dragging) {
                let nx = localX - dragRef.current.offX;
                let ny = localY - dragRef.current.offY;
                const clamped = clampPos(nx, ny, winSize.w, winSize.h, sec, PAD);
                setWinPos(clamped);
            }

            if (resizeRef.current.resizing) {
                const dx = localX - resizeRef.current.startX;
                const dy = localY - resizeRef.current.startY;
                const desiredW = resizeRef.current.startW + dx;
                const desiredH = resizeRef.current.startH + dy;
                const clampedSize = clampSize(desiredW, desiredH, winPos.x, winPos.y, sec, MIN_W, MIN_H, PAD);
                setWinSize(clampedSize);
            }
        };

        const onUp = () => {
            dragRef.current.dragging = false;
            resizeRef.current.resizing = false;
            document.body.style.userSelect = '';
            document.body.style.cursor = '';
        };

        window.addEventListener('mousemove', onMove);
        window.addEventListener('mouseup', onUp);

        // re-clamp on resize
        const onWindowResize = () => {
            const sec = getSectionRect(sectionRef);
            const { x, y } = clampPos(winPos.x, winPos.y, winSize.w, winSize.h, sec, PAD);
            const { w, h } = clampSize(winSize.w, winSize.h, x, y, sec, MIN_W, MIN_H, PAD);
            if (x !== winPos.x || y !== winPos.y) setWinPos({ x, y });
            if (w !== winSize.w || h !== winSize.h) setWinSize({ w, h });
        };
        window.addEventListener('resize', onWindowResize);

        return () => {
            window.removeEventListener('mousemove', onMove);
            window.removeEventListener('mouseup', onUp);
            window.removeEventListener('resize', onWindowResize);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [winPos.x, winPos.y, winSize.w, winSize.h, MIN_W, MIN_H, PAD]);


    // outside click to close within the Experience section
    useEffect(() => {
        const onSectionDown = (e) => {
            if (!sectionRef.current || !windowRef.current || windowRef.current.contains(e.target)) return;
            setShowPreview(false);
            setActiveData(null);
        };
        const sec = sectionRef.current;
        if (sec) sec.addEventListener('mousedown', onSectionDown, { capture: true });
        return () => { if (sec) sec.removeEventListener('mousedown', onSectionDown, { capture: true }); };
    }, [setShowPreview, setActiveData, sectionRef]);

    // Esc to close
    useEffect(() => {
        const onKey = (e) => { if (e.key === 'Escape') { setShowPreview(false); setActiveData(null); } };
        if (setShowPreview) window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [setShowPreview, setActiveData]);

    return (
        <div
            ref={windowRef}
            role="dialog"
            aria-modal="false"
            className="absolute z-[70] border border-gray-800 rounded-lg shadow-2xl overflow-hidden bg-[#1e1e1e] preview-window"
            style={{
                top: winPos.y,
                left: winPos.x,
                width: winSize.w,
                height: winSize.h,
            }}
            onMouseDown={(e) => e.stopPropagation()} // keep outside-click-to-close behavior
        >
            {/* title bar / drag handle */}
            <div
                className="flex items-center justify-between bg-[#2c2c2c] px-3 py-1.5 border-b border-gray-700 cursor-default select-none preview-window-title-bar"
                onMouseDown={startDrag}
            >
                <div className="flex items-center gap-2 text-gray-300 preview-window-controls">
                    {/* Mac dots on the window itself */}
                    <button
                        onClick={() => { setShowPreview(false); setActiveData(null); }}
                        className="w-3.5 h-3.5 rounded-full bg-red-500 cursor-pointer"
                        aria-label="Close preview"
                        title="Close"
                        onMouseDown={(e) => e.stopPropagation()}
                    />
                    <button
                        onClick={() => { setShowPreview(false); }}
                        className="w-3.5 h-3.5 rounded-full bg-yellow-400 cursor-pointer"
                        aria-label="Minimize preview"
                        title="Minimize"
                        onMouseDown={(e) => e.stopPropagation()}
                    />
                    <button
                        type="button"
                        className="w-3.5 h-3.5 rounded-full bg-green-500 cursor-pointer"
                        aria-label="Maximize preview"
                        title="Maximize"
                        onClick={handleMaximize}
                        onMouseDown={e => e.stopPropagation()}
                    />
                    <span className="ml-2 font-semibold text-xs preview-window-title">Preview</span>
                </div>
                <button
                    onClick={() => { setShowPreview(false); setActiveData(null); }}
                    className="text-white/70 hover:text-white text-xl leading-none px-2 cursor-pointer close-button"
                    aria-label="Close preview"
                    onMouseDown={(e) => e.stopPropagation()}
                >
                    ×
                </button>
            </div>

            {/* ONLY the card */}
            <div className="h-[calc(100%-34px)] bg-[#0f0f0f] preview-window-content"> {/* Adjusted height to account for larger title bar */}
                <JsonViz data={activeData} />
            </div>

            {/* resize handle */}
            <div
                className="absolute right-0 bottom-0 w-4 h-4 bg-gray-700/50 hover:bg-gray-700 cursor-se-resize flex items-center justify-center text-gray-400 resize-handle"
                onMouseDown={startResize}
                title="Resize"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevrons-down-right"><path d="m19 19-5-5" /><path d="m5 5 5 5" /><path d="m15 19 4-4" /><path d="m5 9 4-4" /></svg>
            </div>
        </div>
    );
};

export default ExperienceWindow;