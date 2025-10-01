const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors');
const path = require('path');
const { getAdresse, getResultats, getDeuxJours } = require('./public/scrape');

const app = express();
app.use(cors());

// Servir les fichiers statiques (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// Route pour le scraping
app.get('/scrape', async (req, res) => {
    try {
        const url = req.query.url;
        if (!url) return res.status(400).send('URL manquante');

        // Extraire le tid de l'URL
        const tidMatch = url.match(/tid=(\d+)/);
        const tid = tidMatch ? tidMatch[1] : null;
        console.log("Requête de scraping pour tid:", tid);

        // Charger la page du tournoi
        const response = await axios.get(url);
        const $ = cheerio.load(response.data);

        // Récupérer les résultats si on a un tid
        const resultats = tid ? await getResultats(tid) : [];
        console.log(`Nombre de résultats trouvés: ${resultats.length}`);

        // Récupérer l'adresse à partir du document déjà chargé
        const adresse = getAdresse($);
        
        // Récupérer le nom du tournoi
        const nom = $('title').text().trim();

        // Vérifier si le tournoi est sur deux jours
        const deuxJours = getDeuxJours($);

        res.json({ url, adresse, nom, resultats, deuxJours });
    } catch (error) {
        console.error("Erreur :", error);
        res.status(500).json({ error: error.message });
    }
});

// Route pour servir ton fichier HTML principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Utilise le port fourni par Render ou 3000 en local
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});
