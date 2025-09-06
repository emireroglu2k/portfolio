import React from 'react';
import {ScrollTrigger, SplitText} from "gsap/all";
import gsap from "gsap";
import Navbar from "./components/Navbar.jsx";
import Hero from "./components/Hero.jsx";
import Experience from "./components/Experience/Experience.jsx";
import Education from "./components/Education.jsx";
import Projects from "./components/Projects/Projects.jsx";
import Skills from "./components/Skills.jsx";
import Footer from "./components/Footer.jsx";
import ClickSpark from "./components/ClickSpark.jsx";

gsap.registerPlugin(ScrollTrigger, SplitText);

const App = () => {
    return (
        <main>
            <ClickSpark
                sparkColor='#fff'
                sparkSize={10}
                sparkRadius={15}
                sparkCount={8}
                duration={400}
            >
                <Navbar />
                <Hero />
                <Experience />
                <Education />
                <Projects />
                <Skills />
                <Footer />
            </ClickSpark>

        </main>
    );
};

export default App;