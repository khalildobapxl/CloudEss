/*

To retrieve multiple items using a Partition Key that is composite:

*/

import { DynamoDBClient, QueryCommand } from '@aws-sdk/client-dynamodb';

const dynamoDB = new DynamoDBClient({ region: 'your-region' });

export const handler = async (event) => {
    try {
        const partitionKey = event.key;

        const params = {
            TableName: 'YourTableName',
            KeyConditionExpression: 'id = :id',
            ExpressionAttributeValues: {
                ':id': { S: partitionKey },
            },
        };

        const result = await dynamoDB.send(new QueryCommand(params));
        return {
            statusCode: 200,
            body: JSON.stringify({ items: result.Items }),
        };
    } catch (error) {
        console.error(error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Error querying items', error: error.message }),
        };
    }
};
