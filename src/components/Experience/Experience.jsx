import React, {useLayoutEffect, useMemo, useRef} from 'react';
import {experiences} from '../../../constants/index.js';
import ExperienceCard from './ExperienceCard.jsx';
import gsap from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// same helper: parse only START date from "August 2025 – September 2025"
const startLabelFromDuration = (duration = '') => {
    if (!duration) return '';
    const normalized = String(duration).replace(/[–—]/g, '-');
    return normalized.split('-')[0]?.trim() || '';
};

const Experience = () => {
    const scrollingTextContent = useMemo(() => Array(20).fill('Experience ').join(' '), []);
    const sectionRef = useRef(null);

    // CARD track
    const trackRef = useRef(null);
    const spacerRef = useRef(null);
    const firstCardRef = useRef(null);

    // TIMELINE track (moves with cards)
    const tTrackRef = useRef(null);
    const tSpacerRef = useRef(null);

    const progressRef = useRef(null);

    useLayoutEffect(() => {
        if (!sectionRef.current || !trackRef.current || !tTrackRef.current) return;

        const ctx = gsap.context(() => {
            const sizeSpacer = () => {
                const vw = window.innerWidth || 0;
                const w = firstCardRef.current ? firstCardRef.current.offsetWidth : vw * 0.6;
                const leftPad = Math.max(0, (vw - w) / 2);
                if (spacerRef.current) spacerRef.current.style.width = `${leftPad}px`;
                if (tSpacerRef.current) tSpacerRef.current.style.width = `${leftPad}px`;
            };

            sizeSpacer();

            // One tween that moves BOTH tracks together
            const tween = gsap.to([trackRef.current, tTrackRef.current], {
                x: () => {
                    const distance = Math.max(0, trackRef.current.scrollWidth - window.innerWidth);
                    return -distance;
                },
                ease: 'none',
            });

            const st = ScrollTrigger.create({
                animation: tween,
                trigger: sectionRef.current,
                start: 'top top',
                end: () => {
                    const distance = Math.max(0, trackRef.current.scrollWidth - window.innerWidth);
                    // Make scroll slower on mobile by increasing the multiplier
                    const isMobile = window.innerWidth <= 768;
                    const multiplier = isMobile ? 1 : 0.7;
                    return `+=${distance * multiplier}`;
                },
                pin: true,
                anticipatePin: 0.2,
                scrub: 0.8,
                invalidateOnRefresh: true,
                onRefreshInit: sizeSpacer,
                onUpdate: (self) => {
                    if (progressRef.current) {
                        gsap.to(progressRef.current, {
                            width: `${self.progress * 100}%`,
                            duration: 0.2,
                            ease: 'power2.out',
                            overwrite: 'auto',
                        });
                    }
                },
            });

            return () => st.kill();
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section
            id="experience"
            ref={sectionRef}
            className="relative z-10 w-full experience-section"
        >
            {/* Use a STABLE viewport height container */}
            <div
                className="pin-inner full-viewport-h flex flex-col"
                style={{ minHeight: 'var(--app-height)' }} // stable; not affected by browser bars
            >
                {/* Title */}
                <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-modern-negra text-yellow text-center pt-16 sm:pt-20 mb-14 sm:mb-24 mt-12 sm:mt-8 relative z-10 outline-title">
                    Experience
                </h2>

                {/* CARD TRACK */}
                <div className="relative overflow-hidden">
                    <div
                        ref={trackRef}
                        className="experience-track flex items-stretch gap-24 sm:gap-28 md:gap-32 lg:gap-40 will-change-transform"
                        aria-label="Experience carousel"
                    >
                        {/* Spacer to center the first card */}
                        <div ref={spacerRef} className="shrink-0" aria-hidden />

                        {experiences.map((exp, idx) => (
                            <div
                                key={idx}
                                ref={idx === 0 ? firstCardRef : null}
                                className="shrink-0 w-[70dvw] sm:w-[60dvw] lg:w-[45dvw] xl:w-[38dvw]"
                            >
                                <ExperienceCard data={exp} />
                            </div>
                        ))}

                        <div className="shrink-0 w-[25dvw]" aria-hidden />
                    </div>
                </div>

                {/* TIMELINE */}
                <div className="pb-2 sm:pb-3 mt-6">
                    {/* Fixed rail + progress fill */}
                    <div className="relative mb-3 sm:mb-4">
                        <div className="h-1 w-full rounded-full bg-white/10" />
                        <div
                            ref={progressRef}
                            className="h-1 -mt-1 rounded-full bg-yellow relative z-10"
                            style={{ width: '0%' }}
                        />
                    </div>

                    {/* Moving timeline content (START date labels) */}
                    <div
                        ref={tTrackRef}
                        className="flex items-start gap-24 sm:gap-28 md:gap-32 lg:gap-40 will-change-transform"
                        aria-hidden="true"
                    >
                        <div ref={tSpacerRef} className="shrink-0" />
                        {experiences.map((exp, i) => (
                            <div
                                key={`tick-${i}`}
                                className="shrink-0 w-[70dvw] sm:w-[60dvw] lg:w-[45dvw] xl:w-[38dvw] flex flex-col items-center text-center"
                            >
                                <span className="block h-2 w-2 rounded-full bg-white/70" />
                                <span className="mt-2 text-[11px] sm:text-xs md:text-sm text-white/80 whitespace-nowrap">
                  {startLabelFromDuration(exp?.duration)}
                </span>
                            </div>
                        ))}
                        <div className="shrink-0 w-[10dvw]" />
                    </div>
                </div>
            </div>

            {/* Background scrolling text (outside flow) */}
            <div className="scrolling-text-bg-r absolute top-4 sm:top-8 bleed-100vw pointer-events-none">
                <div className="scroll-content">
                    <span>{scrollingTextContent}</span>
                    <span>{scrollingTextContent}</span>
                </div>
            </div>
            <div className="scrolling-text-bg-l absolute bottom-0 bleed-100vw pointer-events-none">
                <div className="scroll-content">
                    <span>{scrollingTextContent}</span>
                    <span>{scrollingTextContent}</span>
                </div>
            </div>
        </section>
    );
};

export default Experience;
