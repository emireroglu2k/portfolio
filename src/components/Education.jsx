// Education.jsx
import React from 'react';
import { educationDiplomas } from '../../constants/index.js';
import { gsap } from 'gsap';

const Education = () => {
    const sectionRef = React.useRef(null);
    const framesRef = React.useRef([]);
    const papersRef = React.useRef([]);

    const setFrameRef = (el, i) => (framesRef.current[i] = el);
    const setPaperRef = (el, i) => (papersRef.current[i] = el);

    const scrollingTextContent = React.useMemo(
        () => Array(20).fill('Education ').join(' '),
        []
    );

    React.useEffect(() => {
        if (!sectionRef.current || !framesRef.current.length) return;

        const prefersReduced =
            typeof window !== 'undefined' &&
            window.matchMedia &&
            window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        // base 3D context
        gsap.set(framesRef.current, {
            transformPerspective: 800,
            transformStyle: 'preserve-3d',
            willChange: 'transform',
        });

        const onEnter = (i) => {
            if (prefersReduced) return;
            const frame = framesRef.current[i];
            const paper = papersRef.current[i];
            gsap.to(frame, { z: 20, duration: 0.18, ease: 'power2.out' });
            gsap.to(paper, {
                boxShadow: '0 14px 30px rgba(0,0,0,0.25)',
                duration: 0.2,
                ease: 'power2.out',
            });
        };

        const onLeave = (i) => {
            const frame = framesRef.current[i];
            const paper = papersRef.current[i];
            gsap.to(frame, {
                rotateX: 0,
                rotateY: 0,
                z: 0,
                duration: 0.3,
                ease: 'power3.out',
            });
            gsap.to(paper, {
                boxShadow: 'inset 0 2px 12px rgba(0,0,0,.07)',
                duration: 0.25,
                ease: 'power2.out',
            });
        };

        const onMove = (i, e) => {
            if (prefersReduced) return;
            const frame = framesRef.current[i];
            if (!frame) return;
            const rect = frame.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const rx = gsap.utils.mapRange(0, rect.height, 6, -6, y);
            const ry = gsap.utils.mapRange(0, rect.width, -8, 8, x);
            gsap.to(frame, { rotateX: rx, rotateY: ry, duration: 0.18, ease: 'power2.out' });
        };

        const onFocus = (i) => {
            // tiny lift for keyboard focus
            gsap.to(framesRef.current[i], { z: 12, duration: 0.15, ease: 'power2.out' });
        };

        const onBlur = (i) => onLeave(i);

        // attach listeners and keep references for cleanup
        const handlers = framesRef.current.map((el, i) => {
            if (!el) return null;
            const enter = () => onEnter(i);
            const leave = () => onLeave(i);
            const move = (e) => onMove(i, e);
            const focus = () => onFocus(i);
            const blur = () => onBlur(i);

            el.addEventListener('pointerenter', enter);
            el.addEventListener('pointerleave', leave);
            el.addEventListener('pointermove', move);
            el.addEventListener('focus', focus);
            el.addEventListener('blur', blur);

            return { el, enter, leave, move, focus, blur };
        });

        return () => {
            handlers.forEach((h) => {
                if (!h) return;
                const { el, enter, leave, move, focus, blur } = h;
                el.removeEventListener('pointerenter', enter);
                el.removeEventListener('pointerleave', leave);
                el.removeEventListener('pointermove', move);
                el.removeEventListener('focus', focus);
                el.removeEventListener('blur', blur);
            });
            gsap.killTweensOf(framesRef.current);
            gsap.killTweensOf(papersRef.current);
        };
    }, []);

    return (
        <section
            id="education"
            ref={sectionRef}
            className="relative z-10 w-full min-h-[60vh] py-20 px-5 education-section"
        >
            {/* BG scrolling text */}
            <div className="scrolling-text-bg-r absolute top-0 bleed-100vw">
                <div className="scroll-content">
                    <span>{scrollingTextContent}</span>
                    <span>{scrollingTextContent}</span>
                </div>
            </div>
            <div className="scrolling-text-bg-l absolute bottom-0 bleed-100vw">
                <div className="scroll-content">
                    <span>{scrollingTextContent}</span>
                    <span>{scrollingTextContent}</span>
                </div>
            </div>

            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-modern-negra text-yellow text-center mb-16 relative z-10 outline-title">
                Education
            </h2>

            {/* Diplomas */}
            <div className="flex flex-col lg:flex-row gap-10 items-center justify-center my-10">
                {educationDiplomas.map((d, i) => (
                    <div
                        key={`${d.university}-${i}`}
                        ref={(el) => setFrameRef(el, i)}
                        className="diploma-frame outerBevel focus:outline-none"
                        tabIndex={0}
                        aria-label={`${d.university} diploma`}
                    >
                        <div className="flatSurface">
                            {/* inner thin gold line */}
                            <span aria-hidden="true" className="gold-line" />
                            <div className="innerBevel">
                                <div
                                    ref={(el) => setPaperRef(el, i)}
                                    className="map shine paper-texture diploma-paper"
                                >
                                    {/* watermark */}
                                    <img
                                        src={d.logo}
                                        alt=""
                                        aria-hidden="true"
                                        className="diploma-watermark"
                                    />

                                    {/* content */}
                                    <article className="diploma-content relative w-full mx-auto select-none h-full flex flex-col justify-center">
                                        {/* crest */}
                                        <img
                                            src={d.logo}
                                            alt={`${d.university} logo`}
                                            className="d-crest"
                                            loading="lazy"
                                        />

                                        <header className="text-center d-header">
                                            <p className="diploma-word">Diploma</p>
                                            <h3 className="uni">{d.university}</h3>
                                            <div className="divider" />
                                        </header>

                                        <div className="text-center mt-3">
                                            <p className="dept">{d.department}</p>
                                        </div>

                                        <div className="mt-4 text-center">
                                            <p className="meta">
                                                {d.startDate} – {d.endDate}
                                            </p>
                                            <p className="meta">{d.location}</p>
                                            <p className="meta gpa">GPA: {d.gpa}</p>
                                        </div>

                                        {/* footer lines */}
                                        <footer className="mt-auto grid grid-cols-2 gap-8 items-end relative d-footer">
                                            {/* left: signature */}
                                            <div className="footer-slot">
                                                <span className="rule" aria-hidden="true" />
                                                <span className="label">Signature</span>
                                                {d.signature && (
                                                    <img
                                                        src={d.signature}
                                                        alt="Signature"
                                                        className="diploma-signature"
                                                        loading="lazy"
                                                    />
                                                )}
                                            </div>

                                            {/* right: date */}
                                            <div className="footer-slot">
                                                <span className="rule" aria-hidden="true" />
                                                <span className="label">Date</span>
                                                <span className="diploma-date">
                          {d.diplomaDate || '—'}
                        </span>
                                            </div>
                                        </footer>
                                    </article>

                                    {/* stamp (static now) */}
                                    <img
                                        src="/images/stamp.png"
                                        alt="Official stamp"
                                        className="diploma-stamp"
                                        loading="lazy"
                                        aria-hidden="true"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Education;
