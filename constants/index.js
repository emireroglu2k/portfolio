// constants/index.js
export const navLinks = [
    { id: "experience", title: "Experience" },
    { id: "education", title: "Education" },
    { id: "projects", title: "Projects" },
    { id: "skills", title: "Skills" },
    { id: "contact", title: "Contact" },
];

// Projects file metadata for Projects.jsx (labels, logos, file names)
export const experienceFiles = [
    {
        name: 'alrod_dynamics.json',
        label: 'Alrod Dynamics',
        logo: '/images/logos/alrod_logo.png'
    },
    {
        name: 'aselsan.json',
        label: 'ASELSAN (Intern)',
        logo: '/images/logos/aselsan_logo_small.png'
    },
    {
        name: 'aselsan(1).json',
        label: 'ASELSAN (Long Term Intern)',
        logo: '/images/logos/aselsan_logo_small.png'
    },
];

// Use widely available CDN logos (devicon/jsdelivr/simpleicons/vectorlogo)
export const experiences = [
    {
        title: "Long Term Intern",
        company: "ASELSAN",
        companyLogo: "images/logos/aselsan_logo_small.png",
        duration: "February 2025 – June 2025",
        location: "Ankara, Turkey",
        type: "Artificial Intelligence and Natural Language Processing",
        description: [
            "Conducted research on **AI applications** in **requirements analysis**.",
            "Worked on the integration of **Retrieval-Augmented Generation (RAG)** models."
        ]
    },
        {
        title: "Summer Intern",
        company: "ASELSAN",
        companyLogo: "images/logos/aselsan_logo_small.png",
        duration: "July 2025 – August 2025",
        location: "Ankara, Turkey",
        type: "Java Web Development",
        description: [
            "Contributed to the development of a **dependency analysis tool** to make the codebase more structured and modular using **Java** and **Spring Boot**.",
            "Designed an interactive interface to visualize dependency relationships using **React** and **TypeScript**."
        ],
        technologies: [
            { name: "Java",        logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg" },
            { name: "Spring Boot", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/spring/spring-original.svg" },
            { name: "React",       logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" },
            { name: "TypeScript",  logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" }
        ],
    },
    {
        title: "Summer Intern",
        company: "Alrod Dynamics",
        companyLogo: "images/logos/alrod_logo.png",
        duration: "August 2025 – September 2025",
        location: "Ankara, Turkey",
        type: "Computer Vision, Object Detection and Classification",
        description: [
            "Developed deep learning-based **Object Detection** models to identify anomalies in solar panels from drone-captured thermal images.",
            "Conducted model training, data augmentation, and performance analysis using the **RF-DETR (Detection Transformer)** architecture on the **Roboflow** platform with **Python**."
        ],
        technologies: [
            { name: "Python",    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" },
            { name: "Roboflow",  logo: "https://logosandtypes.com/wp-content/uploads/2025/02/roboflow.svg" },
        ],
    },

];

export const educationDiplomas = [
    {
        university: "Bilkent University",
        department: "Computer Science",
        gpa: "3.46/4.00",
        startDate: "2022",
        endDate: "2026 (Expected)",
        location: "Ankara, Turkey",
        logo: "images/logos/bilkent_logo.png",
        signature: "images/signature1.png",
        diplomaDate: "not yet"
    },
    {
        university: "Gazi Anatolian High School",
        department: "Science-Mathematics",
        gpa: "94.93/100",
        startDate: "2018",
        endDate: "2022",
        location: "Ankara, Turkey",
        logo: "images/logos/Ankara_Gazi_Anadolu_Lisesi_Logosu.png",
        signature: "images/signature.png",
        diplomaDate: "17.06.2022"
    },
];

// Projects file metadata for Projects.jsx (labels, logos, file names)
export const projectFiles = [
    {
        name: 'bilkent_navigator.json',
        label: 'Bilkent Navigator',
        // using React logo as a recognizable stand-in for the MERN stack
        logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg'
    },
    {
        name: 'hotel_booking.json',
        label: 'Hotel Booking System',
        logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flask/flask-original.svg'
    },
    {
        name: 'bilconnect.json',
        label: 'Bilconnect',
        logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg'
    },
];

// Use widely available CDN logos (devicon/jsdelivr/simpleicons/vectorlogo)
export const projects = [
    {
        name: "Bilkent Navigator",
        techStack: "MERN Stack",
        logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
        date: "December 2024",
        type: "Campus Tour Booking Web App",
        description: [
            "Developed a web application for Bilkent University’s Information Office to streamline campus tour bookings for high school students and counselors.",
            "Designed features including an automated campus tour request system, real-time **email notifications**, **role-based user interfaces**, **guide calendar management**, and a **guide rating system**.",
            "Implemented the application using the **MongoDB**, **Express.js**, **React.js**, **Node.js** stack."
        ],
        technologies: [
            { name: "MongoDB",   logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg" },
            { name: "Express.js",logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg" },
            { name: "React.js",  logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" },
            { name: "Node.js",   logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" },
            { name: "GitHub",    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg" }
        ],
    },
    {
        name: "Hotel Booking & Management System",
        techStack: "Flask, SQLite",
        logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flask/flask-original.svg",
        date: "May 2025",
        type: "Multi-Role Hotel Booking Platform",
        description: [
            "Developed a web application supporting **guest**, **hotel manager**, and **admin** roles to facilitate hotel booking processes.",
            "Implemented features such as **hotel search and filtering**, **room reservations**, **wallet-based payments**, **review system**, and a **loyalty program**.",
            "Used **Flask**, **SQLite**, and **Bootstrap 5** throughout the development process."
        ],
        technologies: [
            { name: "Flask",      logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flask/flask-original.svg" },
            { name: "SQLite",     logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sqlite/sqlite-original.svg" },
            { name: "Bootstrap 5",logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bootstrap/bootstrap-original.svg" },
            { name: "Python",     logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" }
        ],
    },
    {
        name: "Bilconnect",
        techStack: "Android (Java)",
        logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg",
        date: "June 2023",
        type: "Campus Social App",
        description: [
            "Developed an **Android application** aimed at enhancing campus social life at Bilkent University by enabling students to **create and join events**.",
            "Used **Java**, **Firebase**, **Android Studio**, and **GitHub** throughout the development process."
        ],
        technologies: [
            { name: "Java",           logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg" },
            { name: "Firebase",       logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg" },
            { name: "Android Studio", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/androidstudio/androidstudio-original.svg" },
            { name: "GitHub",         logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg" }
        ],
    },
];