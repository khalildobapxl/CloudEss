/*

To retrieve all items in a table:

*/

import { DynamoDBClient, ScanCommand } from '@aws-sdk/client-dynamodb';

const dynamoDB = new DynamoDBClient({ region: 'your-region' });

export const handler = async (event) => {
    try {
        const params = {
            TableName: 'YourTableName',
        };

        const result = await dynamoDB.send(new ScanCommand(params));
        return {
            statusCode: 200,
            body: JSON.stringify({ items: result.Items }),
        };
    } catch (error) {
        console.error(error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Error scanning items', error: error.message }),
        };
    }
};
