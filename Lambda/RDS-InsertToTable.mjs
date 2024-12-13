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
        const test = event.test;

        await client.connect();
        console.log('Verbinding met de database gelukt.');

        // Insert-query om een item toe te voegen
        const insertQuery = 'INSERT INTO testtable (test) VALUES ($1) RETURNING id';
        const values = [test];
        const result = await client.query(insertQuery, values);

        console.log('Item succesvol toegevoegd:', result.rows[0]);

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Item succesvol toegevoegd',
                itemId: result.rows[0].id,
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
