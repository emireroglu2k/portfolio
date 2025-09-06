import React, { useEffect, useRef, useState } from 'react';
import { navLinks } from '../../constants/index.js';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Navbar = () => {
    const navRef = useRef(null);
    const [menuOpen, setMenuOpen] = useState(false);

    // Smooth scroll handler with offset for navbar height
    // Robust scroll handler: retries scroll after layout shifts
    const onNavClick = (e, id) => {
        e.preventDefault();
        const el = document.getElementById(id);
        if (!el) return;
        const nav = navRef.current;
        const navHeight = nav ? nav.offsetHeight : 0;
        let attempts = 0;
        const maxAttempts = 6;
        const scrollToSection = () => {
            const rect = el.getBoundingClientRect();
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const target = rect.top + scrollTop - navHeight - 8;
            window.scrollTo({ top: target, behavior: 'smooth' });
            // If not close enough, try again (layout may have shifted)
            attempts++;
            setTimeout(() => {
                const newRect = el.getBoundingClientRect();
                if (Math.abs(newRect.top - navHeight - 8) > 2 && attempts < maxAttempts) {
                    requestAnimationFrame(scrollToSection);
                }
            }, 80);
        };
        scrollToSection();
    };

    useEffect(() => {
        const nav = navRef.current;
        if (!nav) return;

        // Background color change after leaving the top
        gsap.timeline({
            scrollTrigger: {
                trigger: nav,
                start: 'bottom top',
                toggleActions: 'play none none reverse',
            },
        }).to(nav, {
            backgroundColor: '#000000a0',
            duration: 0.5,
            ease: 'power1.out',
        });

        // Active link highlight per section
        const triggers = [];
        navLinks.forEach(({ id }) => {
            const section = document.getElementById(id);
            const link = nav.querySelector(`a[href="#${id}"]`);
            if (!section || !link) return;

            const st = ScrollTrigger.create({
                trigger: section,
                start: 'top center',
                end: 'bottom center',
                onEnter: () => link.classList.add('active'),
                onEnterBack: () => link.classList.add('active'),
                onLeave: () => link.classList.remove('active'),
                onLeaveBack: () => link.classList.remove('active'),
            });
            triggers.push(st);
        });

        // If content/layout changes
        ScrollTrigger.refresh();
        return () => triggers.forEach(t => t.kill());
    }, []);

    return (
        <nav
            ref={navRef}
            className="fixed z-50 w-full backdrop-blur-sm transition-colors duration-500 ease-out"
            style={{ height: 'var(--nav-h)' }}
        >
            <div className="flex md:flex-row flex-col md:justify-between items-center gap-5 py-5 lg:px-0 px-5 container mx-auto relative">
                {/* Title left-aligned on mobile */}
                <a
                    href="#hero"
                    onClick={(e) => { onNavClick(e, 'hero'); setMenuOpen(false); }}
                    className="flex items-center gap-2 w-full md:w-auto justify-start"
                >
                    <p className="font-modern-negra text-3xl -mb-2">Emir Eroglu</p>
                </a>

                {/* Hamburger icon for small screens */}
                <button
                    className="md:hidden absolute right-5 top-1/2 -translate-y-1/2 p-2 z-50"
                    aria-label="Open menu"
                    onClick={() => setMenuOpen((open) => !open)}
                >
                    <span className="block w-7 h-1 bg-white mb-1 rounded transition-all" style={{ transform: menuOpen ? 'rotate(45deg) translateY(8px)' : 'none' }}></span>
                    <span className={`block w-7 h-1 bg-white mb-1 rounded transition-all ${menuOpen ? 'opacity-0' : ''}`}></span>
                    <span className="block w-7 h-1 bg-white rounded transition-all" style={{ transform: menuOpen ? 'rotate(-45deg) translateY(-8px)' : 'none' }}></span>
                </button>

                {/* Desktop nav links */}
                <ul className="flex-center lg:gap-12 gap-5 md:gap-7 md:flex hidden">
                    {navLinks.map(link => (
                        <li key={link.id}>
                            <a
                                href={`#${link.id}`}
                                onClick={(e) => onNavClick(e, link.id)}
                                className="cursor-pointer text-nowrap md:text-base text-sm nav-link"
                                aria-current={undefined /* set by JS via .active */}
                            >
                                {link.title}
                            </a>
                        </li>
                    ))}
                </ul>

                {/* Mobile nav links (dropdown) */}
                <ul
                    className={`md:hidden flex flex-col gap-4 bg-black/95 px-8 py-8 rounded-xl absolute right-5 top-[110%] shadow-xl transition-all duration-300 ${menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
                    style={{ minWidth: '180px' }}
                >
                    {navLinks.map(link => (
                        <li key={link.id}>
                            <a
                                href={`#${link.id}`}
                                onClick={(e) => { onNavClick(e, link.id); setMenuOpen(false); }}
                                className="cursor-pointer text-nowrap text-base nav-link"
                                aria-current={undefined}
                            >
                                {link.title}
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;
