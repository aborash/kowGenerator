const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());

// Servir les fichiers statiques (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// Route pour le scraping
app.get('/scrape', async (req, res) => {
    try {
        const url = req.query.url;
        if (!url) return res.status(400).send('URL manquante');

        const response = await axios.get(url);
        const $ = cheerio.load(response.data);
        const street = $('[itemprop="streetAddress"]').text().trim();
        const postalCode = $('[itemprop="postalCode"]').text().trim();
        const locality = $('[itemprop="addressLocality"]').text().trim();
        const country = $('[itemprop="addressCountry"]').text().trim();
        const adresse = `${street}, ${postalCode} ${locality}, ${country}`;

        res.json({ adresse });
    } catch (error) {
        console.error("Erreur :", error.message);
        res.status(500).send('Erreur lors du scraping');
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
