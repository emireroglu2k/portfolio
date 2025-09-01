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
        title: "Intern",
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
    {
        title: "Intern",
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
        title: "Candidate Engineer",
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
];

// --- keep your other exports above ---


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
