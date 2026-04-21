const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: '127.0.0.1',
  database: 'testdb',
  password: '1234',
  port: 5433,
});

const encodeImage = (fileName) => {
    const filePath = path.join(__dirname, '../assets/posters', fileName);
    if (!fs.existsSync(filePath)) {
        console.warn(`Image non trouvée : ${fileName}`);
        return null;
    }
    const imageBuffer = fs.readFileSync(filePath);
    return `data:image/png;base64,${imageBuffer.toString('base64')}`;
};

async function runSeed() {
    try {
        console.log("Nettoyage et remplissage de la base de données...");
        
        await pool.query('TRUNCATE TABLE videos RESTART IDENTITY');

        const BUCKET_URL = "http://localhost:9000/videos-bucket/";

        const catalogue = [
            { 
                titre: "Filmorago", 
                fichier: "Filmorago Film d'action.mp4", 
                poster: "filmorago.png", 
                cat: "Action" 
            },
            { 
                titre: "La Reine du Lycée", 
                fichier: "La Reine du Lycée.mp4", 
                poster: "la reine du lycée.png", 
                cat: "Drame" 
            },
            { 
                titre: "Un Prof pas Comme les Autres", 
                fichier: "Un Prof pas Comme les Autres.mp4", 
                poster: "un prof pas comme les autres.png", 
                cat: "Comédie" 
            },
            { 
                titre: "Working Mom", 
                fichier: "Working Mom.mp4", 
                poster: "working mom.png", 
                cat: "Comédie" 
            }
        ];

        for (let v of catalogue) {
            const base64Img = encodeImage(v.poster);
            const urlVideo = BUCKET_URL + encodeURIComponent(v.fichier);

            await pool.query(
                'INSERT INTO videos (titre, description, url_video, photo_couverture, categorie) VALUES ($1, $2, $3, $4, $5)',
                [v.titre, `Découvrez le film ${v.titre} sur PureVision.`, urlVideo, base64Img, v.cat]
            );
            console.log(`${v.titre} inséré avec succès.`);
        }

        console.log("\nTerminé.");
    } catch (err) {
        console.error("Erreur :", err);
    } finally {
        pool.end();
    }
}

runSeed();