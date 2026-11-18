import Navbar from '../navbar/navbar';
import Hero from '../hero/hero';
import About from '../about/about';
import Timeline from '../timeline/timeline';
import Projects from '../projects/projects';
import Contact from '../contact/contact';
import Footer from '../footer/footer';

function Home() {
    const scrollTo = (id) => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div>
            <Navbar scrollTo={scrollTo} />
            <Hero />
            <About />
            <Timeline />
            <Projects />
            <Contact />
            <Footer />
        </div>
    );
}

export default Home;
