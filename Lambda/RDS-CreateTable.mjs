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

        // testtable vervangen met een naam
        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS testtable ( 
                id SERIAL PRIMARY KEY,
                test VARCHAR(255)
            );
        `;
        await client.query(createTableQuery);
        console.log('Table "testtable" created or already exists.');

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Table testtable created successfully!',
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
