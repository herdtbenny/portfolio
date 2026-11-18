import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import Home from './home/home';
import Finanzboard from "./projects/finanzboard/finanzboard";
import Kochbuch from "./projects/kochbuch/kochbuch";
import Foodie from "./projects/foodie/foodie";
import { PROJECTS } from "./projects/projectData";
import EmptyPage from "./components/emptyPage";
import ScrollManager from "./components/scrollManager";

// xG Lab and Sport Scorings moved to their own repos and deployments; their old paths
// here forward to wherever the project card links, so existing links keep working.
const MOVED = { '/xg-lab': 'xglab', '/sportScorings': 'sportscorings' };

function ExternalRedirect({ to }) {
    useEffect(() => { window.location.replace(to); }, [to]);
    return null;
}

function App() {
    return (
        <BrowserRouter>
            <ScrollManager />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/finanzboard" element={<Finanzboard />} />
                <Route path="/kochbuch" element={<Kochbuch />} />
                <Route path="/foodie" element={<Foodie />} />
                {Object.entries(MOVED).map(([path, id]) => (
                    <Route key={path} path={path} element={<ExternalRedirect to={PROJECTS.find((p) => p.id === id).href} />} />
                ))}
                <Route
                    path="*"
                    element={<EmptyPage title="Seite nicht gefunden" desc="Diese Seite gibt es nicht (mehr). Alle Projekte findest du auf der Startseite." />}
                />
            </Routes>
            <Analytics />
        </BrowserRouter>
    );
}

export default App;
