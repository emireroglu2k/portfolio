import React, { useEffect, useRef } from 'react';
import { navLinks } from '../../constants/index.js';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Navbar = () => {
    const navRef = useRef(null);

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
            <div className="flex md:flex-row flex-col md:justify-between items-center gap-5 py-5 lg:px-0 px-5 container mx-auto">
                <a href="#hero" onClick={(e) => onNavClick(e, 'hero')} className="flex items-center gap-2">
                    <p className="font-modern-negra text-3xl -mb-2">Emir Eroglu</p>
                </a>

                <ul className="flex-center lg:gap-12 gap-5 md:gap-7">
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
            </div>
        </nav>
    );
};

export default Navbar;
