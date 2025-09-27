const express = require('express');
const cheerio = require('cheerio');
const { getAdresseFromUrl, getResultats } = require('./public/scrape');

const app = express();
const PORT = 3000;

// Servir les fichiers statiques du dossier public
app.use(express.static('public'));

// Route pour scraper un tournoi
app.get('/scrape', async (req, res) => {
    console.log("Requête de scraping reçue");
    const url = req.query.url;
    if (!url) {
        return res.status(400).json({ error: 'URL manquante' });
    }

    try {
        // Extraire le tid de l'URL
        const tidMatch = url.match(/tid=(\d+)/);
        const tid = tidMatch ? tidMatch[1] : null;

        // Récupérer les résultats si on a un tid
         console.log("recup des resultats "+tid);
        const resultats = tid ? await getResultats(tid) : [];

        // Récupérer l'adresse et le nom
        const data = await getAdresseFromUrl(url);
        
        res.json({
            url,
            adresse: data,
            resultats
        });
    } catch (error) {
        console.error('Erreur:', error);
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Serveur lancé sur http://localhost:${PORT}`);
});