import React, { useState, useRef, useLayoutEffect, useEffect, useMemo } from 'react';
import { experiences, experienceFiles } from '../../../constants/index.js';
import { highlightJson, useLocalStorage, getSectionRect, clampPos, clampSize } from './utils.js';
import ExperienceWindow from './ExperienceWindow.jsx';

const MIN_W_PHONE = 280; // Minimum width for phone screens
const MIN_H_PHONE = 250; // Minimum height for phone screens
const PAD_PHONE = 4; // Smaller padding for phones

const Experience = () => {
    // ---------- editor state ----------
    const [activeTab, setActiveTab] = useState('alrod_dynamics.json');
    const containerRef = useRef(null);
    const measurerRef = useRef(null);
    const panelRefs = useRef({});
    const [maxHeight, setMaxHeight] = useState(0);
    const [containerWidth, setContainerWidth] = useState(0);

    // scope refs
    const sectionRef = useRef(null); // whole Experience section (positioning context)
    const ideBoxRef = useRef(null);   // IDE wrapper (for initial centering)
    const jsonTabContentRef = useRef(null); // Ref for the active JSON tab's content

    // marquee text
    const scrollingTextContent = useMemo(() => Array(20).fill('Experience ').join(' '), []);

    // files (raw + highlighted)
    const files = useMemo(() => {
        return experienceFiles.map((file, idx) => {
            const { technologies, companyLogo, ...rest } = experiences[idx] || {};
            // For preview: include technologies and companyLogo in raw only if defined
            const raw = {
                ...rest,
                ...(technologies !== undefined ? { technologies } : {}),
                ...(companyLogo !== undefined ? { companyLogo } : {})
            };
            // For IDE tab: exclude technologies and companyLogo from content
            return { ...file, raw, content: highlightJson(JSON.stringify(rest, null, 2)) };
        });
    }, []);

    const fileMap = useMemo(() => {
        const m = new Map();
        files.forEach(f => m.set(f.name, f));
        return m;
    }, [files]);

    useEffect(() => {
        files.forEach((f) => {
            if (!panelRefs.current[f.name]) panelRefs.current[f.name] = React.createRef();
        });
    }, [files]);

    useLayoutEffect(() => {
        const updateWidth = () => { if (containerRef.current) setContainerWidth(containerRef.current.clientWidth); };
        updateWidth();
        window.addEventListener('resize', updateWidth);
        return () => window.removeEventListener('resize', updateWidth);
    }, []);

    useLayoutEffect(() => {
        const measure = () => {
            if (!measurerRef.current) return;
            let max = 0;
            files.forEach((f) => {
                const el = panelRefs.current[f.name]?.current;
                if (el) { el.style.height = 'auto'; max = Math.max(max, el.scrollHeight); }
            });
            setMaxHeight(max + 36);
        };
        measure();
        if (document?.fonts?.ready) { document.fonts.ready.then(() => measure()).catch(() => { }); }
    }, [files, containerWidth]);

    // ---------- preview window state ----------
    const [showPreview, setShowPreview] = useState(false);
    const [activeData, setActiveData] = useState(null);

    // Responsive minimums and padding
    const isMobile = window.innerWidth < 768; // Tailwind's 'md' breakpoint
    const MIN_W = isMobile ? MIN_W_PHONE : 300;
    const MIN_H = isMobile ? MIN_H_PHONE : 300;
    const PAD = isMobile ? PAD_PHONE : 8;

    const [winPos, setWinPos] = useLocalStorage('exp_preview_pos', { x: 24, y: 24 });
    const [winSize, setWinSize] = useLocalStorage('exp_preview_size', { w: 800, h: 480 });

    // First mount: set initial position/size to center in current viewport (like handleMaximize)
    useLayoutEffect(() => {
        const hasSavedPos = !!localStorage.getItem('exp_preview_pos');
        const hasSavedSize = !!localStorage.getItem('exp_preview_size');
        const sec = getSectionRect(sectionRef);
        let initialW = isMobile ? Math.round(window.innerWidth * 0.96) : 800;
        let initialH = isMobile ? Math.round(window.innerHeight * 0.7) : 480;
        const { w, h } = clampSize(
            hasSavedSize ? winSize.w : initialW,
            hasSavedSize ? winSize.h : initialH,
            0, 0, sec, MIN_W, MIN_H, PAD
        );
        let x = winPos.x, y = winPos.y;
        if (!hasSavedPos) {
            const scrollY = window.scrollY || window.pageYOffset;
            const viewportH = window.innerHeight;
            const viewportW = window.innerWidth;
            const secRect = sectionRef.current?.getBoundingClientRect() || { top: 0, height: sec.height };
            const secTop = secRect.top + scrollY;
            const centerY = Math.max(scrollY, secTop) + Math.min(viewportH, secRect.height) / 2 - h / 2 - secTop;
            const centerX = (viewportW - w) / 2;
            const clamped = clampPos(centerX, centerY, w, h, sec, PAD);
            x = clamped.x;
            y = clamped.y;
        } else {
            const clamped = clampPos(winPos.x, winPos.y, w, h, sec, PAD);
            x = clamped.x;
            y = clamped.y;
        }
        if (x !== winPos.x || y !== winPos.y) setWinPos({ x, y });
        if (w !== winSize.w || h !== winSize.h) setWinSize({ w, h });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Better initial size & position (on first open only): responsive & centered on current viewport
    const handleRun = () => {
        const current = fileMap.get(activeTab);
        setActiveData(current?.raw ?? null);

        const hasSavedPos = !!localStorage.getItem('exp_preview_pos');
        const hasSavedSize = !!localStorage.getItem('exp_preview_size');

        const sec = getSectionRect(sectionRef);
        let targetW, targetH;

        if (jsonTabContentRef.current && !hasSavedSize) {
            const jsonTabRect = jsonTabContentRef.current.getBoundingClientRect();
            targetW = Math.max(MIN_W, Math.min(sec.width * 0.9, jsonTabRect.width));
            targetH = Math.max(MIN_H, Math.min(sec.height * 0.7, jsonTabRect.height + (isMobile ? 30 : 40)));
        } else if (!hasSavedSize) {
            targetW = Math.round(Math.min(1000, Math.max(MIN_W, sec.width * (isMobile ? 0.95 : 0.8))));
            targetH = Math.round(Math.min(540, Math.max(MIN_H, sec.height * (isMobile ? 0.7 : 0.55))));
        } else {
            targetW = winSize.w;
            targetH = winSize.h;
        }

        const sizeClamped = clampSize(targetW, targetH, winPos.x, winPos.y, sec, MIN_W, MIN_H, PAD);
        setWinSize(sizeClamped);

        if (!hasSavedPos) {
            // Center on current viewport (scroll position)
            const scrollY = window.scrollY || window.pageYOffset;
            const viewportH = window.innerHeight;
            const viewportW = window.innerWidth;
            // Section's top relative to page
            const secRect = sectionRef.current.getBoundingClientRect();
            const secTop = secRect.top + scrollY;
            // Center in visible viewport area of section
            const centerY = Math.max(scrollY, secTop) + Math.min(viewportH, secRect.height) / 2 - sizeClamped.h / 2 - secTop;
            const centerX = (viewportW - sizeClamped.w) / 2;
            const { x, y } = clampPos(centerX, centerY, sizeClamped.w, sizeClamped.h, sec, PAD);
            setWinPos({ x, y });
        } else {
            const { x, y } = clampPos(winPos.x, winPos.y, sizeClamped.w, sizeClamped.h, sec, PAD);
            setWinPos({ x, y });
            setWinSize(clampSize(sizeClamped.w, sizeClamped.h, x, y, sec, MIN_W, MIN_H, PAD));
        }

        setShowPreview(true);
    };

    // ---------- render ----------
    return (
        <section id="experience" ref={sectionRef} className="relative z-10 w-full py-20 px-5 experience-section">
            {/* Background Scrolling Text - Left */}
            <div className="scrolling-text-bg-l absolute top-0 bleed-100vw">
                <div className="scroll-content"><span>{scrollingTextContent}</span><span>{scrollingTextContent}</span></div>
            </div>

            {/* Background Scrolling Text - Right */}
            <div className="scrolling-text-bg-r absolute bottom-0 bleed-100vw">
                <div className="scroll-content"><span>{scrollingTextContent}</span><span>{scrollingTextContent}</span></div>
            </div>

            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-modern-negra text-yellow text-center mb-16 relative z-10">
                Experience
            </h2>

            <div
                ref={ideBoxRef}
                className="bg-[#1e1e1e] rounded-lg shadow-xl-vintage border border-gray-800 overflow-hidden max-w-full lg:max-w-4xl mx-auto mb-10 relative ide-box"
            >
                {/* IDE Title Bar */}
                <div className="flex items-center bg-[#3c3c3c] px-4 py-2 border-b border-gray-700 ide-title-bar">
                    <div className="flex space-x-2">
                        {/* Mac dots on IDE bar — red/yellow close the preview if open */}
                        <button
                            onClick={() => { setShowPreview(false); setActiveData(null); }}
                            className="w-3 h-3 rounded-full bg-red-500 cursor-not-allowed"
                            aria-label="Close preview"
                            title="Close"
                        />
                        <button
                            onClick={() => { setShowPreview(false); }}
                            className="w-3 h-3 rounded-full bg-yellow-400 cursor-not-allowed"
                            aria-label="Minimize preview"
                            title="Minimize"
                        />
                        <span className="w-3 h-3 rounded-full bg-green-500 cursor-not-allowed" />
                    </div>
                    <div className="flex-grow text-center text-gray-300 text-sm font-semibold ide-file-name">
                        {activeTab}
                    </div>

                    {/* Run button */}
                    <button
                        onClick={handleRun}
                        className="ml-auto inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-yellow text-black text-sm font-semibold border-b-2 cursor-pointer run-button"
                        style={{ borderColor: 'color-mix(in oklab, black 25%, var(--color-yellow))' }}
                        aria-label="Run (preview)"
                    >
                        <span className="inline-block">▶</span>
                        Run
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex flex-wrap bg-[#2c2c2c] border-b border-gray-700 ide-tabs">
                    {files.map((file) => (
                        <button
                            key={file.name}
                            className={`flex items-center gap-2 px-4 sm:px-6 py-3 text-sm font-mono focus:outline-none transition-colors duration-200 ide-tab-button
                            ${activeTab === file.name
                                ? 'bg-[#1e1e1e] text-yellow border-t-2 border-yellow'
                                : 'text-gray-400 hover:bg-[#3a3a3a] hover:text-gray-200 border-t-2 border-transparent'
                            }`}
                            onClick={() => setActiveTab(file.name)}
                        >
                            {file.logo && <img src={file.logo} alt="" className="w-4 h-4 object-cover rounded-sm" />}
                            <span>{file.label}</span>
                        </button>
                    ))}
                </div>

                {/* Editor */}
                <div
                    ref={containerRef}
                    className="p-4 sm:p-6 text-white font-mono text-sm relative ide-editor-content"
                    style={{ height: maxHeight || undefined, transition: 'height 200ms ease' }}
                >
                    {files.map((file) =>
                        activeTab === file.name ? (
                            <pre
                                key={file.name}
                                ref={jsonTabContentRef} // Attach ref here
                                className="whitespace-pre-wrap break-words"
                                dangerouslySetInnerHTML={{ __html: file.content }}
                            />
                        ) : null
                    )}

                    {/* Off-screen measurer */}
                    <div
                        ref={measurerRef}
                        aria-hidden="true"
                        className="absolute -left-[9999px] top-0"
                        style={{ width: containerWidth || 'auto' }}
                    >
                        {files.map((file) => (
                            <pre
                                key={`measure-${file.name}`}
                                ref={panelRefs.current[file.name]}
                                className="whitespace-pre-wrap break-words"
                                dangerouslySetInnerHTML={{ __html: file.content }}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* Movable & Resizable Preview Window */}
            {showPreview && (
                <ExperienceWindow
                    sectionRef={sectionRef}
                    winPos={winPos}
                    setWinPos={setWinPos}
                    winSize={winSize}
                    setWinSize={setWinSize}
                    activeData={activeData}
                    setShowPreview={setShowPreview}
                    setActiveData={setActiveData}
                    MIN_W={MIN_W}
                    MIN_H={MIN_H}
                    PAD={PAD}
                />
            )}
        </section>
    );
};

export default Experience;