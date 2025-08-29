import React, { useRef, useLayoutEffect } from "react";
import { FileText, Mail, Linkedin, Github } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const Hero = () => {
    const imageContainerRef = useRef(null); // Assuming this will be used for an image soon, currently not in JSX
    const sectionRef = useRef(null);
    const titleRef = useRef(null);
    const titleOverlayRef = useRef(null);
    const thinkMakeSolveRef = useRef(null);
    const subtitleRef = useRef(null);
    const subtitleItalicRef = useRef(null);
    const resumeBtnRef = useRef(null);
    const socialIconsRef = useRef([]);

    useLayoutEffect(() => {
        let mounted = true; // To prevent updates on unmounted component

        // Helper to wait for the next animation frame
        const nextFrame = () => new Promise(requestAnimationFrame);

        // Wait for fonts to be ready
        const fontsReady = document?.fonts ? document.fonts.ready : Promise.resolve();

        // Wait for video metadata if video element exists
        const videoEl = document.querySelector('#hero-video'); // Use the ID you added
        const videoReady = videoEl
            ? (videoEl.readyState >= 1
                ? Promise.resolve()
                : new Promise(resolve => {
                    const onMeta = () => {
                        videoEl.removeEventListener('loadedmetadata', onMeta);
                        resolve();
                    };
                    videoEl.addEventListener('loadedmetadata', onMeta, { once: true });
                    // Fallback timeout in case metadata event doesn't fire promptly
                    setTimeout(resolve, 1500); // Increased timeout slightly
                }))
            : Promise.resolve();

        const setupAnimations = async () => {
            // Wait for critical resources to be loaded
            await Promise.all([fontsReady, videoReady]);
            // Wait for two animation frames to ensure layout is settled after resource loading
            await nextFrame();
            await nextFrame();

            if (!mounted) return; // Exit if component unmounted during async operations

            // GSAP context for all animations
            const ctx = gsap.context(() => {
                // Collect all animatable elements and filter out nulls
                const animatableElements = [
                    thinkMakeSolveRef.current,
                    subtitleRef.current,
                    subtitleItalicRef.current,
                    resumeBtnRef.current,
                    ...socialIconsRef.current,
                    imageContainerRef.current // Include if you add an image later
                ].filter(Boolean);

                const titleElements = [titleRef.current, titleOverlayRef.current].filter(Boolean);

                // INITIAL STATE - All elements start invisible/transformed
                gsap.set(animatableElements, { autoAlpha: 0, y: 30 });
                if (imageContainerRef.current) { // Only set if imageContainerRef exists
                    gsap.set(imageContainerRef.current, { autoAlpha: 0, scale: 0.8, rotation: -10 });
                }
                gsap.set(titleElements, { opacity: 0, y: 50, scale: 0.8 });

                // INTRO TIMELINE
                const tl = gsap.timeline({
                    defaults: { ease: "power3.out", duration: 1 },
                    onComplete: () => {
                        // Ensure button transition property is set AFTER initial animation
                        if (resumeBtnRef.current) {
                            resumeBtnRef.current.style.transitionProperty = "background-color,border-color,color";
                        }
                    }
                });

                tl.to(
                    titleElements,
                    { opacity: 1, y: 0, scale: 1, duration: 1.2, ease: "power3.out", stagger: 0.2, overwrite: true },
                    0 // Start immediately
                )
                    .to(thinkMakeSolveRef.current, { autoAlpha: 1, y: 0, duration: 0.8 }, "-=0.5")
                    .to(subtitleRef.current, { autoAlpha: 1, y: 0, duration: 0.8 }, "-=0.4")
                    .to(subtitleItalicRef.current, { autoAlpha: 1, y: 0, duration: 0.8 }, "-=0.3")
                    .to(resumeBtnRef.current, { autoAlpha: 1, y: 0, duration: 0.8 }, "-=0.2")
                    .to(socialIconsRef.current, { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.15 }, "-=0.1");

                // Only add image animation if the ref is present
                if (imageContainerRef.current) {
                    tl.to(imageContainerRef.current, { autoAlpha: 1, duration: 1.2 }, "-=0.5");
                }


                // Once the intro animation completes and the initial layout is stable, set up ScrollTriggers
                // We use another timeline here to manage ScrollTrigger creation after the intro.
                tl.then(() => {
                    if (!mounted) return;

                    // Fade out targets on scroll
                    const fadeTargets = [
                        resumeBtnRef.current,
                        imageContainerRef.current, // Include if you add an image later
                        thinkMakeSolveRef.current,
                        subtitleRef.current,
                        subtitleItalicRef.current,
                        ...socialIconsRef.current
                    ].filter(Boolean); // Ensure all targets are valid

                    if (fadeTargets.length > 0) { // Only create ScrollTrigger if there are targets
                        gsap.to(fadeTargets, {
                            autoAlpha: 0,
                            stagger: { amount: 0.15 },
                            ease: "none", // Simpler ease for scrubbed animation
                            scrollTrigger: {
                                trigger: sectionRef.current,
                                start: "top top",
                                end: "center top",
                                scrub: 0.8,
                                invalidateOnRefresh: true,
                                immediateRender: true,
                            }
                        });
                    }


                    // Title parallax
                    if (titleRef.current) { // Only animate if titleRef.current exists
                        gsap.to(
                            titleRef.current,
                            {
                                autoAlpha: 0,
                                ease: "none", // Simpler ease for scrubbed animation
                                scrollTrigger: {
                                    trigger: sectionRef.current,
                                    start: "top top",
                                    end: "center 45%",
                                    scrub: 0.8,
                                    invalidateOnRefresh: true,
                                    immediateRender: true,
                                }
                            }
                        );
                    }

                    // Final refresh after all ScrollTriggers are created
                    ScrollTrigger.refresh();
                });
            }, sectionRef); // GSAP context scope

            return () => ctx.revert(); // Return the cleanup function directly
        };

        let cleanupFn;
        setupAnimations().then(fn => {
            if (mounted) { // Ensure component is still mounted before setting cleanupFn
                cleanupFn = fn;
            }
        });

        return () => {
            mounted = false; // Mark component as unmounted
            if (cleanupFn) {
                cleanupFn(); // Call the actual cleanup function
            }
        };
    }, []); // Empty dependency array means this runs once on mount

    return (
        <section id="hero" className="noisy min-h-dvh flex flex-col pt-20 pb-10" ref={sectionRef}>
            {/* Video Background */}
            <video
                id="hero-video" // Added an ID for direct query
                className="absolute inset-0 w-full h-full object-cover -z-10 opacity-50"
                src="public/videos/gradientBG.mp4"
                autoPlay
                loop
                muted
                playsInline
            />
            {/* Title Wrapper for positioning and outline effect */}
            <div className="title-wrapper relative">
                <h1 className="title outline-text" ref={titleRef}> Emir Eroglu</h1>

                {/* New: Outline Text Overlay */}
                <div className="absolute inset-0 flex items-center justify-center mt-3 lg:mt-5">
                    <h1 className="title outline-text-overlay" style={{ WebkitTextStroke: "2px white", color: "transparent" }} ref={titleOverlayRef}>
                        Emir Eroglu
                    </h1>
                </div>

            </div>

            {/* Main content area */}
            <div className="body container mx-auto flex flex-col lg:flex-row justify-between items-start lg:items-end px-5 flex-grow mt-10">
                {/* left content */}
                <div className="content">
                    <div className="space-y-2 lg:space-y-5 block">
                        <p className="hidden lg:block" ref={thinkMakeSolveRef}>
                            Think. <i>Make.</i> Solve.
                        </p>

                        <p className="subtitle" ref={subtitleRef}>
                            Software Developer & <br className="hidden lg:inline" />
                            Computer Science Student
                            <br />
                            <i className="hidden lg:inline" ref={subtitleItalicRef}>Based in Ankara, Turkey</i>
                        </p>
                    </div>
                </div>

                {/* right-bottom actions */}
                <div className="actions">
                    <div className="fade-in-up stagger-3 flex flex-wrap items-center justify-center gap-6">
                        <a
                            href="/public/assets/Emir_Eroglu_CV_en.pdf"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-resume group custom-tooltip-trigger"
                            aria-label="View my Resume"
                            data-tooltip="View My Resume"
                            ref={resumeBtnRef}
                        >
                            <FileText className="w-4 h-4 mr-2" />
                            Resume
                        </a>
                    </div>

                    <div className="fade-in-up stagger-4 flex items-center justify-center gap-6">
                        <a
                            href="mailto:emireroglu2k@gmail.com"
                            className="icon-link custom-tooltip-trigger"
                            aria-label="Email Emir Eroğlu"
                            data-tooltip="emireroglu2k@gmail.com"
                            ref={el => socialIconsRef.current[0] = el}
                        >
                            <Mail className="w-8 h-8 stroke-current fill-none" />
                        </a>

                        <a
                            href="https://linkedin.com/in/emir-eroglu"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="icon-link custom-tooltip-trigger"
                            aria-label="LinkedIn profile"
                            data-tooltip="emir-eroglu"
                            ref={el => socialIconsRef.current[1] = el}
                        >
                            <Linkedin className="w-8 h-8 stroke-current fill-none" />
                        </a>

                        <a
                            href="https://github.com/emireroglu2k"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="icon-link custom-tooltip-trigger"
                            aria-label="GitHub profile"
                            data-tooltip="emireroglu2k"
                            ref={el => socialIconsRef.current[2] = el}
                        >
                            <Github className="w-8 h-8 stroke-current fill-none" />
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;