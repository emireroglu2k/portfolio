import React from 'react';
import {ScrollTrigger, SplitText} from "gsap/all";
import gsap from "gsap";
import Navbar from "./components/Navbar.jsx";
import Hero from "./components/Hero.jsx";
import Experience from "./components/Experience/Experience.jsx";
import Education from "./components/Education.jsx";
import Projects from "./components/Projects/Projects.jsx";

gsap.registerPlugin(ScrollTrigger, SplitText);

const App = () => {
    return (
        <main>
            <Navbar />
            <Hero />
            <Experience />
            <Education />
            <Projects />
        </main>
    );
};

export default App;