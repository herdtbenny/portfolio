import { useEffect, useState } from 'react';
import LoopingVideo from '../components/loopingVideo';
import Navbar from '../navbar/navbar';
import Hero from '../hero/hero';
import About from '../about/about';
import Focus from '../focus/focus';
import Timeline from '../timeline/timeline';
import Projects from '../projects/projects';
import Contact from '../contact/contact';
import Footer from '../footer/footer';

const SCROLL_FADE_DISTANCE = 700;

function Home() {
    const scrollTo = (id) => {
        document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
    };

    const [scrollProgress, setScrollProgress] = useState(0);

    useEffect(() => {
        let raf = null;
        const onScroll = () => {
            if (raf) return;
            raf = requestAnimationFrame(() => {
                setScrollProgress(Math.min(1, Math.max(0, window.scrollY / SCROLL_FADE_DISTANCE)));
                raf = null;
            });
        };
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', onScroll);
        return () => {
            window.removeEventListener('scroll', onScroll);
            window.removeEventListener('resize', onScroll);
            if (raf) cancelAnimationFrame(raf);
        };
    }, []);

    const blur = scrollProgress * 28;
    const brightness = 1 - scrollProgress * 0.55;
    const scale = 1 + scrollProgress * 0.1;
    const overlayOpacity = scrollProgress * 0.35;

    return (
        <div>
            <div className="fixed inset-0 -z-10 overflow-hidden">
                <LoopingVideo
                    src="/bgVideo.mp4"
                    poster="/bgPoster.jpg"
                    style={{ filter: `blur(${blur}px) brightness(${brightness}) saturate(1.3)`, transform: `scale(${scale})` }}
                />
                <div className="pointer-events-none absolute inset-0 bg-black" style={{ opacity: overlayOpacity }} />
                <div className="noise-overlay pointer-events-none absolute inset-0 opacity-[0.7] mix-blend-overlay" />
            </div>

            <Navbar scrollTo={scrollTo} />
            <Hero />
            <About />
            <Focus />
            <Timeline />
            <Projects />
            <Contact />
            <Footer />
        </div>
    );
}

export default Home;
