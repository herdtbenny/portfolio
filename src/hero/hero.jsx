import { FiChevronDown } from 'react-icons/fi';
import BlurText from '../components/blurText';
import bennyHero from '../assets/benny-hero.png';

const NAME_CLASS =
    'justify-center whitespace-nowrap font-serif text-[100px] font-bold uppercase leading-[0.75] tracking-tighter text-ink sm:text-[140px] md:text-[180px] lg:text-[210px]';

function Hero() {
    const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

    return (
        <section id="hero" className="relative flex min-h-[100svh] flex-col overflow-hidden bg-cream">
            {/* name with the portrait centered on top of it */}
            <div className="absolute left-1/2 top-1/2 w-full -translate-x-1/2 -translate-y-1/2 px-4">
                <h1 className="relative m-0 text-center" aria-label="Benny Herdt">
                    <span className="block"><BlurText as="span" text="BENNY" delay={100} animateBy="letters" className={NAME_CLASS} /></span>
                    <span className="block"><BlurText as="span" text="HERDT" delay={100} animateBy="letters" className={NAME_CLASS} /></span>

                    <span className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
                        <span className="block h-[110px] w-[65px] cursor-pointer overflow-hidden rounded-full bg-[#e5e5e5] shadow-2xl transition-transform duration-300 hover:scale-110 sm:h-[152px] sm:w-[90px] md:h-[185px] md:w-[110px] lg:h-[218px] lg:w-[129px]">
                            <img src={bennyHero} alt="Benny Herdt" className="h-full w-full object-cover object-top" width={390} height={659} />
                        </span>
                    </span>
                </h1>
            </div>

            {/* tagline, well below the name */}
            <div className="absolute bottom-16 left-1/2 w-full -translate-x-1/2 px-6 sm:bottom-20 md:bottom-24 lg:bottom-32 xl:bottom-36">
                <div className="flex justify-center">
                    <BlurText
                        text="Software, Product und Agentic Coding aus Regensburg."
                        delay={150}
                        animateBy="words"
                        className="m-0 justify-center text-center font-antic text-[15px] text-stone-500 transition-colors duration-300 hover:text-ink sm:text-[18px] md:text-[20px] lg:text-[22px]"
                    />
                </div>
            </div>

            <button
                type="button"
                onClick={() => scrollTo('about')}
                className="absolute bottom-6 left-1/2 -translate-x-1/2 text-stone-500 transition-colors duration-300 hover:text-ink md:bottom-10"
                aria-label="Nach unten scrollen"
            >
                <FiChevronDown className="h-5 w-5 md:h-8 md:w-8" />
            </button>
        </section>
    );
}

export default Hero;
