import React from "react";
import { Calendar, MapPin } from "lucide-react";

const normalize = (s = "") => s.toLowerCase().replace(/[^a-z0-9]/g, "");

// minimal **highlight** support inside bullet text
const renderDescription = (text = "", technologies = []) => {
  const parts = [];
  const re = /\*\*(.+?)\*\*/g;
  let last = 0;
  let m;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    const highlighted = m[1];
    const match = Array.isArray(technologies)
      ? technologies.find((t) => normalize(t?.name) === normalize(highlighted))
      : null;

    parts.push(
      <mark
        key={`${m.index}-${highlighted}`}
        className="rounded px-1 py-0.5 bg-white/10 text-white/95"
        style={{ boxDecorationBreak: "clone" }}
      >
        {highlighted}
        {match?.logo ? (
          <img
            src={match.logo}
            alt={match.name}
            className="inline-block ml-1 -mt-0.5 h-[1.1em] w-[1.1em] align-[-0.2em] object-contain"
          />
        ) : null}
      </mark>
    );
    last = re.lastIndex;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts;
};

const Field = ({ icon: Icon, children }) => (
  <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm [@media(max-height:760px)]:text-[1.6dvh] sm:[@media(max-height:760px)]:text-[1.7dvh] text-white/70">
  <Icon className="h-4 w-4 text-indigo-400 [@media(max-height:760px)]:h-[1.8dvh] [@media(max-height:760px)]:w-[1.8dvh]" />
    {children}
  </span>
);

const ExperienceCard = ({ data }) => {
  if (!data) return null;
  const {
    title,
    company,
    companyLogo,
    duration,
    location,
    type,
    description = [],
    technologies = [],
  } = data;

  return (
    <div
      className="
        h-full min-h-[22rem] sm:min-h-[24rem] md:min-h-[26rem]
        bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-lg
        rounded-xl shadow-lg border border-white/10
        mx-auto p-4 sm:p-6 md:p-7 [@media(max-height:760px)]:p-3 sm:[@media(max-height:760px)]:p-5
        flex flex-col
      "
    >
      {/* header */}
      <header className="flex items-start gap-2 sm:gap-4">
        {companyLogo ? (
          <img
            src={companyLogo}
            alt={company || "Company"}
            className="
              h-8 w-8 sm:h-12 sm:w-12
              [@media(max-height:760px)]:h-6 [@media(max-height:760px)]:w-6
              sm:[@media(max-height:760px)]:h-10 sm:[@media(max-height:760px)]:w-10
              rounded-md object-contain bg-black/30 border border-white/10 flex-shrink-0
            "
          />
        ) : null}

        <div className="min-w-0 flex-grow">
          <h3 className="text-base xs:text-lg sm:text-xl md:text-2xl [@media(max-height:760px)]:text-[2.2dvh] font-semibold leading-tight text-white/95">
            {company}
            {title ? (
              <span className="text-white/60 font-normal text-sm xs:text-base sm:text-lg [@media(max-height:760px)]:text-[1.8dvh]">
                &nbsp;|&nbsp; {title}
              </span>
            ) : null}
          </h3>

          <div className="mt-2 flex flex-wrap items-center gap-2 sm:gap-3">
            {duration ? <Field icon={Calendar}>{duration}</Field> : null}
            {location ? <Field icon={MapPin}>{location}</Field> : null}
            {type ? (
              <span className="text-[10px] xs:text-[11px] sm:text-xs [@media(max-height:760px)]:text-[1.5dvh] font-semibold text-indigo-200/90 bg-indigo-500/10 border border-indigo-400/20 rounded px-2 py-1 [@media(max-height:760px)]:px-1.5 [@media(max-height:760px)]:py-0.5">
                {type}
              </span>
            ) : null}
          </div>
        </div>
      </header>

      {/* highlights */}
      {description.length > 0 && (
        <section className="mt-4">
          <h4 className="mb-2 text-xs xs:text-sm [@media(max-height:760px)]:text-[1.7dvh] font-semibold text-white/70">
            Highlights
          </h4>
          <ul className="space-y-2 list-disc pl-4">
            {description.map((d, i) => (
              <li
                key={i}
                className="text-xs xs:text-sm sm:text-[15px] [@media(max-height:760px)]:text-[1.6vh] leading-relaxed text-white/85"
              >
                {renderDescription(d, technologies)}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* technologies — hidden on small screens AND when viewport height < 760px */}
      {technologies.length > 0 && (
        <section className="mt-4 hidden sm:block [@media(max-height:760px)]:hidden">
          <h4 className="mb-2 text-xs sm:text-sm [@media(max-height:760px)]:text-[1.7vh] font-semibold text-white/70">
            Technologies
          </h4>
          <div className="flex flex-wrap gap-2 [@media(max-height:760px)]:gap-1.5">
            {technologies.map((t, i) => (
              <span
                key={`${t?.name || i}-${i}`}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 [@media(max-height:760px)]:px-2 [@media(max-height:760px)]:py-0.5 text-[11px] sm:text-xs [@media(max-height:760px)]:text-[1.5vh] text-white/90"
              >
                {t?.logo ? (
                  <img
                    src={t.logo}
                    alt={t.name}
                    className="h-4 w-4 object-contain [@media(max-height:760px)]:h-[1.9vh] [@media(max-height:760px)]:w-[1.9vh]"
                  />
                ) : null}
                {t?.name}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* push content up so cards end evenly */}
      <div className="mt-auto" />
    </div>
  );
};

export default ExperienceCard;
