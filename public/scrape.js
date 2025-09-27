const axios = require('axios');
const cheerio = require('cheerio');

async function getAdresseFromUrl(url) {
    try {
        console.log("Scraping de l'URL :", url);
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

async function getResultats(tid) {
    try {
        console.log("Récupération des résultats pour tid:", tid);
        const response = await axios.get(`https://www.tabletoptournaments.net/fr/t3_tournament_results.php?tid=${tid}`);
        const $ = cheerio.load(response.data);
        const resultats = [];

        // Trouver la section "Note individuelle:"
        const sectionIndividuelle = $('h2:contains("Note individuelle:")');
        if (sectionIndividuelle.length > 0) {
            // Trouver le premier tableau après cette section
            const tableau = sectionIndividuelle.next('table');
            
            // Parcourir uniquement les lignes de ce tableau
            tableau.find('tr').each((i, tr) => {
                const cells = $(tr).find('td');
                if (cells.length >= 2) {
                    const rankText = $(cells[0]).text().trim();
                    const nameText = $(cells[2]).text().trim();
                    if (rankText && nameText) {
                        const rank = parseInt(rankText);
                        if (!isNaN(rank)) {
                            resultats.push({
                                nom: nameText,
                                classement: rank
                            });
                        }
                    }
                }
            });
        }

        return resultats;
    } catch (error) {
        console.error("Erreur lors de la récupération des résultats:", error.message);
        return [];
    }
}

module.exports = {
    getAdresseFromUrl,
    getResultats
};
