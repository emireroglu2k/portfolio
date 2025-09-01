import React from 'react';
import { Calendar, MapPin } from 'lucide-react';

/* -------------------------------------------JSON visualization card-------------------------------------------- */
const ProjectVisualizer = ({ data }) => {
    if (!data) return null;
    const { name, techStack, logo, date, location, type, description = [], technologies = [] } = data;

    // Helper to render description with highlights and tech logos as React elements
    const renderDescription = (text) => {
        if (!text) return null;
        const techs = Array.isArray(technologies) ? technologies : [];

        const parts = [];
        let lastIndex = 0;
        const regex = /\*\*(.+?)\*\*/g; // Regex to find text wrapped in **

        let match;
        let key = 0;
        while ((match = regex.exec(text)) !== null) {
            if (match.index > lastIndex) {
                parts.push(text.slice(lastIndex, match.index));
            }
            const highlighted = match[1]; // The content inside ** **

            // Find tech by normalized name
            const norm = s => s.toLowerCase().replace(/[^a-z0-9]/g, '');
            const found = techs.find(t => norm(t.name) === norm(highlighted));

            parts.push(
                <span className="highlight" key={key++}>
                    {highlighted}
                    {found && found.logo && (
                        <img
                            src={found.logo}
                            alt={found.name}
                            style={{ display: 'inline-block', width: '1.1em', height: '1.1em', verticalAlign: '-0.15em', marginLeft: '0.25em' }}
                        />
                    )}
                </span>
            );
            lastIndex = regex.lastIndex;
        }
        if (lastIndex < text.length) {
            parts.push(text.slice(lastIndex));
        }
        return parts;
    };

    return (
        <div className="p-5 sm:p-6 md:p-8 overflow-auto h-full custom-scrollbar json-viz-card">
            <div className="space-y-6">
                <header className="border-b border-gray-700 pb-4">
                    <h3 className="text-xl md:text-3xl font-modern-negra text-yellow flex flex-wrap items-center gap-2 json-viz-company-title">
                        {logo && (
                            <img
                                src={logo}
                                alt={name}
                                className="inline-block w-8 h-8 object-contain rounded align-middle company-logo"
                                style={{ background: '#23221c', border: '1px solid #444', padding: '2px' }}
                            />
                        )}
                        {name}
                        <span className="text-white/80 text-base md:text-2xl font-normal json-viz-title">
                            {techStack && ` | ${techStack}`}
                        </span>
                    </h3>
                    <div className="flex flex-wrap items-center gap-4 mt-2 json-viz-details">
                        <span className="flex items-center gap-1 text-xs md:text-sm text-white/70">
                            <Calendar className="w-4 h-4 inline-block text-yellow" />
                            {date}
                        </span>
                        <span
                            className="text-xs md:text-sm font-semibold text-yellow px-3 py-1 bg-[#23221c] rounded border border-yellow/30 ml-2 shadow-sm json-viz-type"
                            style={{ letterSpacing: '0.01em' }}
                        >
                            {type}
                        </span>
                    </div>
                </header>

                {!!description.length && (
                    <section>
                        <h4 className="text-white/80 font-semibold mb-2 json-viz-section-title">Highlights</h4>
                        <ul className="space-y-2 list-disc pl-6 json-viz-highlights">
                            {description.map((d, i) => (
                                <li key={i} className="text-white/90  text-sm md:text-base">{renderDescription(d)}</li>
                            ))}
                        </ul>
                    </section>
                )}

                {!!technologies.length && (
                    <section>
                        <h4 className="text-white/80 font-semibold mb-2 json-viz-section-title">Technologies</h4>
                        <div className="flex flex-wrap gap-2 json-viz-technologies">
                            {technologies.map((t, i) => (
                                <span key={i} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2c2c2c] border border-gray-700 text-sm json-viz-tech-tag">
                                    {t.logo && <img src={t.logo} alt="" className="w-4 h-4 object-contain" />}
                                    {t.name}
                                </span>
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
};

export default ProjectVisualizer;