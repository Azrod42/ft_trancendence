import { NextApiRequest, NextApiResponse } from 'next'
import fetch from 'isomorphic-fetch';
import { Pool } from 'pg';
import axios, { AxiosResponse } from 'axios';

console.log("Suite\n");

async function sendMessage(req: NextApiRequest, res: NextApiResponse) {

    console.log("Suite\n");
    if (req.method === 'POST') {
      try {
        const { text } = req.body; // Récupérer le contenu du message depuis le corps de la requête
        // Effectuer le traitement pour stocker le message dans votre système de stockage
        // Par exemple, enregistrer le message dans une base de données
        await saveMessageToDatabase(text);
  
        // Envoyer une réponse de réussite
        res.status(200).json({ message: 'Message sent successfully' });
      } catch (error) {
        console.error('Error sending message:', error);
        // Envoyer une réponse d'erreur en cas de problème
        res.status(500).json({ error: 'An error occurred while sending the message' });
      }
    } else {
      // Gérer les autres méthodes de requête si nécessaire
      res.status(405).end(); // Réponse 405 Method Not Allowed
    }
  }
  
  async function saveMessageToDatabase(text: string) {

    console.log("Suite\n");
    const pool = new Pool({
        connectionString: 'postgres://postgres:Root123@localhost:5432/database',
      });

    const client = await pool.connect();
    try {
      // Exécution d'une requête pour insérer le message dans la table "messages"
      await client.query('INSERT INTO messages (text) VALUES ($1)', [text]);
    } finally {
      client.release();
    }
}
  
  export default sendMessage;