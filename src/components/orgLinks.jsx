// Turns mentions of IMPECT and the OTH Regensburg inside a plain string into
// external links, so every place that names them points to the same site.
const ORGS = [
    { pattern: 'IMPECT(?: GmbH)?', href: 'https://www.impect.com' },
    { pattern: 'OTH Regensburg', href: 'https://www.oth-regensburg.de' },
];

const MATCHER = new RegExp(`(${ORGS.map((o) => o.pattern).join('|')})`, 'g');

const hrefFor = (text) => ORGS.find((o) => new RegExp(`^${o.pattern}$`).test(text))?.href;

function OrgLinks({ children, className = 'hover:text-accent-deep' }) {
    if (typeof children !== 'string') return children;

    return children.split(MATCHER).map((part, i) => {
        const href = hrefFor(part);
        if (!href) return part;
        return (
            <a
                key={i}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className={`text-inherit underline decoration-1 underline-offset-4 transition-colors duration-200 ${className}`}
            >
                {part}
            </a>
        );
    });
}

export default OrgLinks;
