import React from 'react';
import {navLinks} from '../../constants/index.js';
import {useGSAP} from "@gsap/react";
import gsap from "gsap";

const Navbar = () => {
    useGSAP(() => {
        const navElement = document.querySelector('nav');
        if (navElement) { // Ensure nav element exists before creating ScrollTrigger
            const navTween = gsap.timeline({
                scrollTrigger: {
                    trigger: 'nav',
                    start: 'bottom top', // When the bottom of the nav hits the top of the viewport
                    toggleActions: "play none none reverse", // Play on enter, reverse on leave
                    // You might want to remove scrub if you want an instant change or a timed animation
                    // scrub: 0.5, // Uncomment if you want a smooth, scrubbed transition
                }
            });

            // Animate the background color to be darker and more opaque
            // The backdrop-filter CSS will then blur whatever is behind this semi-transparent background.
            navTween.to(navElement, {
                backgroundColor: '#000000a0', // More opaque black for better blur visibility
                duration: 0.5, // Shorter duration for a snappier change
                ease: 'power1.out'
            });

            // If you want to animate the blur amount, you'd need a more complex approach,
            // or animate a custom property and apply it via CSS.
            // For now, let's assume the blur is always present due to CSS.
        }
    }, []); // Empty dependency array for useGSAP
    // Added an empty dependency array to useGSAP to ensure it runs only once.

    return (
        <nav className="fixed z-50 w-full backdrop-blur-sm transition-colors duration-500 ease-out">
            <div>
                <a href="#home" className="flex items-center gap-2">
                    <p>Emir Eroglu</p>
                </a>

                <ul>
                    {navLinks.map((link) => (
                            <li key={link.id}>
                                <a href={`#${link.id}`}>{link.title}</a>
                            </li>
                        )
                    )}
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;