// src/sections/Skills.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { skills as skillsData } from "../../constants/index.js";
import TiltedCard from "../components/TiltedCard.jsx"; // adjust path if needed

const FOCUS_SETTINGS = {
    blurAmount: 5,
    dimOpacity: 0.55,
    grayscale: 60, // %
    animationDuration: 0.3,
};

const Skills = () => {
    const [activeCategory, setActiveCategory] = useState("All");
    const [focusColor, setFocusColor] = useState("#ff0"); // will be replaced by title color
    const titleRef = useRef(null);

    // Pull the computed color from the title so focus matches it
    useEffect(() => {
        if (!titleRef.current) return;
        const color = getComputedStyle(titleRef.current).color;
        if (color) setFocusColor(color);
    }, []);

    // Categories
    const categories = useMemo(
        () => ["All", ...skillsData.map((c) => c.title)],
        []
    );

    // Flatten everything once
    const allSkills = useMemo(
        () =>
            skillsData.flatMap((category) =>
                category.items.map((item) => ({ ...item, category: category.title }))
            ),
        []
    );

    const scrollingTextContent = useMemo(
        () => Array(20).fill("Skills ").join(" "),
        []
    );

    return (
        <section
            id="skills"
            className="relative z-10 w-full min-h-[60dvh] px-2 sm:px-5 skills-section"
            style={{
                scrollMarginTop: "calc(var(--nav-h, 72px) + 16px)",
                paddingTop: "2rem",
                paddingBottom: "2rem",
            }}
        >
            {/* BG scrolling text */}
            <div className="scrolling-text-bg-r absolute top-0 bleed-100dvw pointer-events-none select-none">
                <div className="scroll-content">
                    <span>{scrollingTextContent}</span>
                    <span>{scrollingTextContent}</span>
                </div>
            </div>
            <div className="scrolling-text-bg-l absolute bottom-0 bleed-100dvw pointer-events-none select-none">
                <div className="scroll-content">
                    <span>{scrollingTextContent}</span>
                    <span>{scrollingTextContent}</span>
                </div>
            </div>

            <h2
                ref={titleRef}
                className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-modern-negra text-yellow text-center mb-6 sm:mb-10 relative z-10 outline-title"
            >
                Skills
            </h2>

            {/* Category Filter Buttons */}
            <div className="relative z-10 flex flex-wrap justify-center gap-2.5 sm:gap-3.5 mb-6 sm:mb-10 px-2">
                {categories.map((category) => (
                    <button
                        key={category}
                        onClick={() => setActiveCategory(category)}
                        className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-xs lg:text-base font-medium transition-all duration-300 ease-in-out
              ${
                            activeCategory === category
                                ? "bg-yellow text-background-dark shadow-md"
                                : "bg-gray-700 text-gray-200 hover:bg-gray-600 hover:text-white"
                        }`}
                    >
                        {category}
                    </button>
                ))}
            </div>

            {/* Skills Grid */}
            <div className="relative z-10 max-w-7xl mx-auto">
                <motion.div
                    layout
                    className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-5 md:gap-10 justify-items-center mb-16"
                >
                    {allSkills.map((skill) => {
                        const isAll = activeCategory === "All";
                        const isActive = isAll || skill.category === activeCategory;

                        return (
                            <motion.div
                                key={`${skill.category}-${skill.name}`}
                                layout
                                className="
                  relative
                  w-full
                  max-w-[84px]    sm:max-w-[96px]
                  md:max-w-[112px] lg:max-w-[128px] xl:max-w-[144px]
                  aspect-square
                  flex flex-col items-center justify-start
                  p-1.5 sm:p-2
                "
                                style={{
                                    // Only blur/dim when a specific category is selected
                                    filter: isAll
                                        ? "none"
                                        : isActive
                                            ? "none"
                                            : `blur(${FOCUS_SETTINGS.blurAmount}px) grayscale(${FOCUS_SETTINGS.grayscale}%) brightness(0.9)`,
                                    opacity: isAll ? 1 : isActive ? 1 : FOCUS_SETTINGS.dimOpacity,
                                    transition: `filter ${FOCUS_SETTINGS.animationDuration}s ease, opacity ${FOCUS_SETTINGS.animationDuration}s ease`,
                                }}
                            >
                                {/* Corner "target" ticks only for focused cards (no border/glow) */}
                                {!isAll && isActive && (
                                    <motion.div
                                        aria-hidden
                                        className="pointer-events-none absolute inset-0"
                                        initial={false}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ duration: FOCUS_SETTINGS.animationDuration }}
                                        style={{ color: focusColor }}
                                    >
                                        {/* Use current color for the ticks */}
                                        <span
                                            className="absolute w-3.5 h-3.5 border-[3px] rounded-[3px] top-[0px] left-[0px] sm:top-[-8px] sm:left-[-8px] border-r-0 border-b-0"
                                            style={{ borderColor: "currentColor" }}
                                        />
                                        <span
                                            className="absolute w-3.5 h-3.5 border-[3px] rounded-[3px] top-[0px] right-[0px] sm:top-[-8px] sm:right-[-8px] border-l-0 border-b-0"
                                            style={{ borderColor: "currentColor" }}
                                        />
                                        <span
                                            className="absolute w-3.5 h-3.5 border-[3px] rounded-[3px] bottom-[0px] left-[0px] sm:bottom-[-8px] sm:left-[-8px] border-r-0 border-t-0"
                                            style={{ borderColor: "currentColor" }}
                                        />
                                        <span
                                            className="absolute w-3.5 h-3.5 border-[3px] rounded-[3px] bottom-[0px] right-[0px] sm:bottom-[-8px] sm:right-[-8px] border-l-0 border-t-0"
                                            style={{ borderColor: "currentColor" }}
                                        />
                                    </motion.div>
                                )}

                                <TiltedCard
                                    imageSrc={skill.logo}
                                    altText={skill.name}
                                    captionText={skill.name}
                                    containerHeight="auto"
                                    containerWidth="100%"
                                    imageHeight={undefined}
                                    imageWidth="100%"
                                    scaleOnHover={1.06}
                                    rotateAmplitude={16}
                                    showMobileWarning={false}
                                    showTooltip={false}
                                    displayOverlayContent={false}
                                    aspectRatio={1}
                                />
                            </motion.div>
                        );
                    })}
                </motion.div>
            </div>
        </section>
    );
};

export default Skills;
