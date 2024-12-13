/*

Syntax for Reading a Single Item (GetItemCommand):


*/

import { DynamoDBClient, GetItemCommand } from '@aws-sdk/client-dynamodb';

const dynamoDB = new DynamoDBClient({ region: 'your-region' });

export const handler = async (event) => {
    try {
        const id = event.id;

        const params = {
            TableName: 'YourTableName',
            Key: {
                id: { S: id }, // Partition key
            },
        };

        const result = await dynamoDB.send(new GetItemCommand(params));
        return {
            statusCode: 200,
            body: JSON.stringify({ item: result.Item }),
        };
    } catch (error) {
        console.error(error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Error retrieving item', error: error.message }),
        };
    }
};
