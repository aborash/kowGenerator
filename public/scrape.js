const axios = require('axios');
const cheerio = require('cheerio');

async function getAdresseFromUrl(url) {
    try {
        const response = await axios.get(url);
        const $ = cheerio.load(response.data);
        const street = $('[itemprop="streetAddress"]').text().trim();
        const postalCode = $('[itemprop="postalCode"]').text().trim();
        const locality = $('[itemprop="addressLocality"]').text().trim();
        const country = $('[itemprop="addressCountry"]').text().trim();
        return `${street}, ${postalCode} ${locality}, ${country}`;
    } catch (error) {
        console.error("Erreur :", error.message);
        return null;
    }
}

