import pkg from 'pg';
const { Client } = pkg

export const handler = async (event) => {
    const dbConfig = {
        host: process.env.DB_HOST,       // e.g. your-rds-endpoint.amazonaws.com
        port: process.env.DB_PORT || 5432,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        ssl: {
            rejectUnauthorized: false,
        },
    };

    const client = new Client(dbConfig);

    try {
        const id = event.id;

        await client.connect();
        console.log('Verbinding met de database gelukt.');

        // Select-query om een item op te halen op basis van id
        const selectQuery = 'SELECT id, test FROM testtable WHERE id = $1';
        const values = [id];
        const result = await client.query(selectQuery, values);

        if (result.rows.length === 0) {
            return {
                statusCode: 404,
                body: JSON.stringify({ message: 'Geen item gevonden met de gegeven id.' }),
            };
        }

        // Het gevonden item
        const item = result.rows[0];
        console.log('Item opgehaald:', item);

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Item succesvol opgehaald',
                item: item,
            }),
        };
    } catch (error) {
        console.error('Error connecting or querying:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: 'Failed to connect or run query',
                error: error.message,
            }),
        };
    } finally {
        await client.end();
        console.log('Connection closed.');
    }
};
