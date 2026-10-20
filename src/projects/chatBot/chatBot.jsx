import { useNavigate } from 'react-router-dom';

function ChatBot() {
    const navigate = useNavigate();

    return (
        <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#000000] px-5 text-center font-syne text-white">
            <div className="pointer-events-none absolute -right-32 -top-32 h-[360px] w-[360px] rounded-full bg-[radial-gradient(circle,rgba(143,176,255,0.10)_0%,transparent_70%)]" />
            <div className="pointer-events-none absolute -bottom-40 -left-32 h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle,rgba(143,176,255,0.06)_0%,transparent_70%)]" />

            <p className="relative m-0 mb-4 font-mono text-7xl font-extrabold tracking-tight text-accent sm:text-8xl">404</p>
            <h1 className="relative m-0 mb-3 text-xl font-bold sm:text-2xl">Eigener KI Chatbot</h1>
            <p className="relative m-0 mb-8 max-w-[420px] font-inter text-sm leading-[1.7] text-neutral-500">
                Diese Seite ist noch im Aufbau. Der Gemini-basierte Chatbot mit eigener UI und Kontextsystem folgt in Kürze.
            </p>
            <button
                onClick={() => navigate('/')}
                className="relative rounded-xl border border-white/10 bg-white/[0.03] px-5 py-3 font-inter text-sm font-semibold text-neutral-300 transition-all duration-200 hover:-translate-y-0.5 hover:border-accent hover:bg-accent/[0.10] hover:text-accent"
            >
                ← Zurück zur Startseite
            </button>
        </div>
    );
}

export default ChatBot;
