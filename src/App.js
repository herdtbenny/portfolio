import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import Home from './home/home';
import SportScorings from "./projects/sportScorings/sportScorings";
import XgLab from "./projects/xgLab/xgLab";
import FinanceTracker from "./projects/financeTracker/financeTracker";
import RbacPlayground from "./projects/rbac/rbacPlayground";
import Breakdown from "./breakdown/breakdown";
import EmptyPage from "./components/emptyPage";
import ScrollManager from "./components/scrollManager";

function App() {
    return (
        <BrowserRouter>
            <ScrollManager />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/aufschluesselung" element={<Breakdown />} />
                <Route path="/sportScorings" element={<SportScorings />} />
                <Route path="/xg-lab" element={<XgLab />} />
                <Route path="/finance-tracker" element={<FinanceTracker />} />
                <Route path="/auth-rollen-system" element={<RbacPlayground />} />
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
