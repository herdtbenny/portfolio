function RevealLine({ inView, delay = 0, className = '', children }) {
    return (
        // overflow-hidden clips the reveal; the padding/negative margin pair gives
        // umlauts and descenders room without shifting the layout
        <span
            className={`block overflow-hidden ${className}`}
            style={{ paddingTop: '0.2em', marginTop: '-0.2em', paddingBottom: '0.12em', marginBottom: '-0.12em' }}
        >
            <span
                className="block transition-transform duration-700 ease-out"
                style={{
                    transform: inView ? 'translateY(0%)' : 'translateY(130%)',
                    transitionDelay: `${delay}ms`,
                }}
            >
                {children}
            </span>
        </span>
    );
}

export default RevealLine;
