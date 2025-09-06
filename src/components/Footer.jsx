// Footer.jsx
import React, { useLayoutEffect, useRef } from "react";
import { Mail, Linkedin, Github, ArrowUp, FileText } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const Footer = () => {
    const year = new Date().getFullYear();
    const sectionRef = useRef(null);
    const itemsRef = useRef([]);

    const subject = encodeURIComponent("👋 Hi Emir — from your portfolio");
    const body = encodeURIComponent("Hey Emir,\n\nLoved your portfolio and wanted to reach out about...");
    const mailTo = `mailto:emireroglu2k@gmail.com?subject=${subject}&body=${body}`;

    const handleBackToTop = (e) => {
        e.preventDefault();
        if (typeof window !== "undefined") {
            const prefersReduced =
                window.matchMedia &&
                window.matchMedia("(prefers-reduced-motion: reduce)").matches;
            prefersReduced ? window.scrollTo(0, 0) : window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    useLayoutEffect(() => {
        if (!sectionRef.current) return;

        const prefersReduced =
            typeof window !== "undefined" &&
            window.matchMedia &&
            window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        const ctx = gsap.context(() => {
            const els = itemsRef.current.filter(Boolean);
            gsap.set(els, { autoAlpha: 0, y: 24 });

            if (prefersReduced) {
                gsap.set(els, { autoAlpha: 1, y: 0 });
                return;
            }

            gsap.to(els, {
                autoAlpha: 1,
                y: 0,
                duration: 0.7,
                ease: "power3.out",
                stagger: 0.1,
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 80%",
                    once: true,
                },
            });
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <footer
            id="contact"
            ref={sectionRef}
            role="contentinfo"
            className="relative mt-24 text-white bg-[#121212] border-t border-white/10 [--gold:#e7d393] pb-[env(safe-area-inset-bottom)]"
            style={{
                backgroundImage:
                    "radial-gradient(40% 90% at 50% 0%, rgba(231,211,147,0.10), transparent 70%)",
            }}
        >
            {/* top border glow */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 -top-px h-px"
                style={{
                    background:
                        "linear-gradient(90deg, transparent, rgba(231,211,147,.9), transparent)",
                }}
            />

            <div className="mx-auto max-w-7xl px-2 sm:px-4 lg:px-8 py-8 sm:py-12 lg:py-16">
                {/* top row */}
                <div className="grid gap-6 sm:gap-8 md:gap-12 lg:gap-16 grid-cols-1 md:grid-cols-3 items-start">
                    {/* Brand / resume */}
                    <div
                        className="space-y-2 sm:space-y-4 lg:space-y-4 text-center md:text-left"
                        ref={(el) => (itemsRef.current[0] = el)}
                    >
                        <h3 className="text-base xs:text-lg sm:text-xl lg:text-xl font-semibold tracking-tight text-balance">
                            Emir Eroğlu
                        </h3>
                        <a
                            href="/assets/Emir_Eroglu_CV_en.pdf"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 rounded-md border border-white/15 px-2.5 py-2 text-xs xs:text-sm sm:text-[15px] lg:px-3 lg:py-2 lg:text-[15px] hover:border-white/25 hover:bg-white/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[--gold]/60 transition"
                            aria-label="View my Resume (opens in new tab)"
                        >
                            <FileText className="w-4 h-4 shrink-0" />
                            <span>Resume</span>
                        </a>
                    </div>

                    {/* Get in touch */}
                    <address
                        className="not-italic space-y-2 sm:space-y-3 lg:space-y-3 flex flex-col items-center justify-center text-center w-full"
                        ref={(el) => (itemsRef.current[1] = el)}
                    >
                        <p className="text-white/60 uppercase tracking-wider text-[10px] xs:text-[11px] sm:text-xs lg:text-xs">
                            Get in touch
                        </p>
                        <a
                            href={mailTo}
                            className="group inline-flex items-center gap-2 text-sm xs:text-[15px] sm:text-base lg:text-base hover:text-[--gold] focus:outline-none focus-visible:ring-2 focus-visible:ring-[--gold]/60 rounded-sm break-all"
                            aria-label="Send an email to Emir Eroğlu"
                        >
                            <Mail className="w-5 h-5 shrink-0" />
                            <span className="underline decoration-white/20 group-hover:decoration-[--gold]/60 break-words hyphens-auto text-xs xs:text-sm lg:text-base">
                                emireroglu2k@gmail.com
                            </span>
                        </a>
                        <p className="text-xs xs:text-[13px] sm:text-sm lg:text-sm text-white/60 max-w-xs xs:max-w-sm sm:max-w-prose lg:max-w-prose px-1 xs:px-2 lg:px-0 break-words hyphens-auto">
                            Feel free to reach out about work, collaborations, or just to say hi. I usually respond within a day.
                        </p>
                    </address>

                    {/* Socials */}
                    <div
                        className="flex flex-col items-center md:items-end gap-2 sm:gap-3 lg:gap-3 text-center md:text-right"
                        ref={(el) => (itemsRef.current[2] = el)}
                    >
                        <p className="text-white/60 uppercase tracking-wider text-[10px] xs:text-[11px] sm:text-xs lg:text-xs">
                            Let&apos;s Connect
                        </p>

                        <a
                            href="https://linkedin.com/in/emir-eroglu"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group inline-flex items-center gap-2 text-sm xs:text-[15px] sm:text-base lg:text-base hover:text-[--gold] focus:outline-none focus-visible:ring-2 focus-visible:ring-[--gold]/60 rounded-sm"
                            aria-label="LinkedIn profile"
                        >
                            <span className="decoration-white/20 group-hover:decoration-[--gold]/60 break-words text-xs xs:text-sm lg:text-base">
                                emir-eroglu
                            </span>
                            <Linkedin className="w-5 h-5 shrink-0" />
                        </a>

                        <a
                            href="https://github.com/emireroglu2k"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group inline-flex items-center gap-2 text-sm xs:text-[15px] sm:text-base lg:text-base hover:text-[--gold] focus:outline-none focus-visible:ring-2 focus-visible:ring-[--gold]/60 rounded-sm"
                            aria-label="GitHub profile"
                        >
                            <span className="decoration-white/20 group-hover:decoration-[--gold]/60 break-words text-xs xs:text-sm lg:text-base">
                                emireroglu2k
                            </span>
                            <Github className="w-5 h-5 shrink-0" />
                        </a>
                    </div>
                </div>

                {/* bottom bar */}
                <div
                    className="mt-8 sm:mt-12 lg:mt-12 border-t border-white/10 pt-4 sm:pt-6 lg:pt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 items-center gap-2 sm:gap-4 lg:gap-4"
                    ref={(el) => (itemsRef.current[3] = el)}
                >
                    <p className="text-[11px] xs:text-[12px] sm:text-[13px] lg:text-[13px] text-white/60 sm:justify-self-start sm:text-left text-center leading-relaxed px-1 xs:px-2 sm:px-0 lg:px-0">
                        © {year} <span className="text-white">Emir Eroğlu</span>. All rights reserved.
                    </p>

                    {/* Built with — centered */}
                    <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-[10px] xs:text-[11px] sm:text-xs lg:text-xs text-white/70">
                        <span className="inline-flex items-center gap-1.5">
                            <img
                                src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg"
                                alt=""
                                className="w-5 h-5 inline-block align-middle"
                            />
                            <span className="align-middle">React</span>
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                            <img
                                src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg"
                                alt=""
                                className="w-5 h-5 inline-block align-middle"
                            />
                            <span className="align-middle">Tailwind</span>
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                            <img
                                src="/images/icons/gsap.svg"
                                alt=""
                                className="w-5 h-5 inline-block align-middle"
                            />
                            <span className="align-middle">GSAP</span>
                        </span>
                    </div>

                    <a
                        href="#top"
                        onClick={handleBackToTop}
                        className="inline-flex items-center gap-2 text-xs lg:text-xs border border-white/15 rounded-md px-2.5 py-2 sm:py-1.5 lg:px-3 lg:py-2 hover:border-white/25 hover:bg-white/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[--gold]/60 transition sm:justify-self-end justify-self-center"
                        aria-label="Back to top"
                    >
                        <ArrowUp className="w-4 h-4 shrink-0" />
                        <span>Back to top</span>
                    </a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
