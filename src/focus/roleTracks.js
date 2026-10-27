// The job profiles this portfolio is built to support. Used by the <Focus>
// section on the home page and the role filter on /aufschluesselung.

export const ROLE_TRACKS = [
    {
        id: 'frontend',
        title: 'Software- & Frontend-Entwicklung',
        short: 'Software Engineering',
        pitch: 'Ich baue Interfaces, die schnell, zugänglich und sauber strukturiert sind – und verstehe, was dahinter auf dem Server passiert.',
        proof: [
            'Im Job: Softwarelösungen für Fußballdatenanalyse bei IMPECT',
            'React, TypeScript, Angular, Java im Einsatz',
            'Eigene Auth-Implementierung mit signierten JWTs',
        ],
    },
    {
        id: 'data',
        title: 'Data & Sports Analytics',
        short: 'Data & Analytics',
        pitch: 'Fußball und Daten sind mein Alltag. Ich übersetze Modelle in Visualisierungen, die auch Nicht-Analysten verstehen.',
        proof: [
            'Werkstudent bei IMPECT, einem Anbieter für Fußballdaten',
            'Eigenes xG-Modell mit exakter Ergebnis-Wahrscheinlichkeit',
            'Trainer-Erfahrung beim SSV Jahn: Ich kenne die Fragen der Praxis',
        ],
    },
    {
        id: 'business',
        title: 'IT-Consulting, Product & Business Analysis',
        short: 'Consulting & Product',
        pitch: 'Als Wirtschaftsinformatiker denke ich vom Problem des Kunden her – und habe mit meiner eigenen Agentur gelernt, Anforderungen in Ergebnisse zu übersetzen.',
        proof: [
            'Eigene Agentur: Akquise, Anforderungen, Umsetzung, Betrieb',
            'Bachelor Wirtschaftsinformatik an der OTH Regensburg',
            'Controlling-Logik und KPI-Design im Finanz-Dashboard',
        ],
    },
];
