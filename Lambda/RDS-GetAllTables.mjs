/*

Deze geeft alle tables terug van de database, je hoeft niks te wijzigen

*/

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
        await client.connect();
        console.log('Verbinding met de database gelukt.');

        const query = `
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
            ORDER BY table_name;
        `;

        const result = await client.query(query);
        console.log('Tables retrieved:', result.rows);

        const tableNames = result.rows.map(row => row.table_name);

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Tables retrieved successfully',
                tables: tableNames
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
