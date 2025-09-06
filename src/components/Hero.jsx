import React, { useRef, useLayoutEffect } from "react";
import { FileText, Mail, Linkedin, Github } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lanyard from "./Lanyard";

gsap.registerPlugin(ScrollTrigger);

const Hero = () => {
  const imageContainerRef = useRef(null);
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const titleOverlayRef = useRef(null);
  const thinkMakeSolveRef = useRef(null);
  const subtitleRef = useRef(null);
  const subtitleItalicRef = useRef(null);
  const resumeBtnRef = useRef(null);
  const socialIconsRef = useRef([]); // plain JS

  useLayoutEffect(() => {
    let mounted = true;

    const nextFrame = () => new Promise(requestAnimationFrame);

    const fontsReady = document?.fonts ? document.fonts.ready : Promise.resolve();

    const videoEl = document.querySelector("#hero-video");
    const videoReady = videoEl
      ? (videoEl.readyState >= 1
          ? Promise.resolve()
          : new Promise((resolve) => {
              const onMeta = () => {
                videoEl.removeEventListener("loadedmetadata", onMeta);
                resolve();
              };
              videoEl.addEventListener("loadedmetadata", onMeta, { once: true });
              setTimeout(resolve, 1500);
            }))
      : Promise.resolve();

    // Set initial state immediately to prevent first paint flash
    const ctx = gsap.context(() => {
      const animatable = [
        thinkMakeSolveRef.current,
        subtitleRef.current,
        subtitleItalicRef.current,
        resumeBtnRef.current,
        ...socialIconsRef.current,
        imageContainerRef.current,
      ].filter(Boolean);

      const titleEls = [titleRef.current, titleOverlayRef.current].filter(Boolean);

      gsap.set(animatable, { autoAlpha: 0, y: 30 });
      if (imageContainerRef.current) {
        gsap.set(imageContainerRef.current, { autoAlpha: 0, scale: 0.8, rotation: -10 });
      }
      gsap.set(titleEls, { opacity: 0, y: 50, scale: 0.8 });
    }, sectionRef);

    // Build a paused intro timeline; play after resources are ready
    const tl = gsap.timeline({
      defaults: { ease: "power3.out", duration: 1 },
      paused: true,
      onComplete: () => {
        if (resumeBtnRef.current) {
          resumeBtnRef.current.style.transitionProperty = "background-color,border-color,color";
        }
      },
    });

    ctx.add(() => {
      const titleEls = [titleRef.current, titleOverlayRef.current].filter(Boolean);

      tl.to(
        titleEls,
        { opacity: 1, y: 0, scale: 1, duration: 1.2, ease: "power3.out", stagger: 0.2, overwrite: true },
        0
      )
        .to(thinkMakeSolveRef.current, { autoAlpha: 1, y: 0, duration: 0.8 }, "-=0.5")
        .to(subtitleRef.current, { autoAlpha: 1, y: 0, duration: 0.8 }, "-=0.4")
        .to(subtitleItalicRef.current, { autoAlpha: 1, y: 0, duration: 0.8 }, "-=0.3")
        .to(resumeBtnRef.current, { autoAlpha: 1, y: 0, duration: 0.8 }, "-=0.2")
        .to(socialIconsRef.current, { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.15 }, "-=0.1");

      if (imageContainerRef.current) {
        tl.to(imageContainerRef.current, { autoAlpha: 1, duration: 1.2 }, "-=0.5");
      }
    });

    (async () => {
      await Promise.all([fontsReady, videoReady]);
      await nextFrame();
      await nextFrame();
      if (!mounted) return;

      tl.play();

      tl.then(() => {
        if (!mounted) return;

        const fadeTargets = [
          resumeBtnRef.current,
          imageContainerRef.current,
          thinkMakeSolveRef.current,
          subtitleRef.current,
          subtitleItalicRef.current,
          ...socialIconsRef.current,
        ].filter(Boolean);

        if (fadeTargets.length) {
          gsap.to(fadeTargets, {
            autoAlpha: 0,
            stagger: { amount: 0.15 },
            ease: "none",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top top",
              end: "center top",
              scrub: 0.8,
              invalidateOnRefresh: true,
              immediateRender: false, // prevent initial jump
            },
          });
        }

        if (titleRef.current) {
          gsap.to(titleRef.current, {
            autoAlpha: 0,
            ease: "none",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top top",
              end: "center 45%",
              scrub: 0.8,
              invalidateOnRefresh: true,
              immediateRender: false, // prevent initial jump
            },
          });
        }

        ScrollTrigger.refresh();
      });
    })();

    return () => {
      mounted = false;
      ctx.revert();
    };
  }, []);

  return (
    <section id="hero" className="noisy min-h-dvh flex flex-col pt-20 pb-10 relative" ref={sectionRef}>
      {/* Video Background */}
      <video
        id="hero-video"
        className="absolute inset-0 w-full h-full object-cover -z-10 opacity-50"
        src="/videos/gradientBG.mp4"
        poster="/videos/gradientBG_poster.jpg"  /* optional: prevents black flash */
        autoPlay
        loop
        muted
        playsInline
      />

      {/* 3D Lanyard — desktop */}
      <div
        className="
          absolute top-0 w-full h-full left-80 overflow-visible
          pointer-events-auto z-3 hidden md:block
        "
        aria-hidden="true"
      >
        <Lanyard position={[0, 0, 20]} fov={20} gravity={[3, -40, 3]} revealAtMs={2250} />
      </div>

      {/* 3D Lanyard — mobile */}
      <div
        className="
          absolute bottom-65 w-full h-full left-30 overflow-visible
          pointer-events-auto z-3 block md:hidden
        "
        aria-hidden="true"
      >
        <Lanyard position={[0, 0, 20]} fov={55} gravity={[8, -40, 3]} revealAtMs={2250} />
      </div>

      {/* Title Wrapper */}
      <div className="title-wrapper relative select-none">
        <h1 className="title outline-text" ref={titleRef}>Emir <br className="md:hidden block"/> Eroglu</h1>

        <div className="absolute inset-0 flex items-center justify-center mt-3 lg:mt-5">
          <h1
            className="title outline-text-overlay"
            style={{ WebkitTextStroke: "2px white", color: "transparent" }}
            ref={titleOverlayRef}
          >
            Emir <br className="md:hidden block"/> Eroglu
          </h1>
        </div>
      </div>

      {/* Main content */}
      <div className="body container mx-auto flex flex-col lg:flex-row justify-between items-start lg:items-end px-5 flex-grow mt-10">
        {/* left content */}
        <div className="content select-none">
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
        <div className="actions z-4">
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
              ref={(el) => (socialIconsRef.current[0] = el)}
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
              ref={(el) => (socialIconsRef.current[1] = el)}
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
              ref={(el) => (socialIconsRef.current[2] = el)}
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
