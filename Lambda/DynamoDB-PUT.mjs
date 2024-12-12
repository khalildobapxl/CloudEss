/*

1. Writing to DynamoDB
To write data to a DynamoDB table, use the PutItemCommand or UpdateItemCommand.

*/

import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb';

// Initialize the DynamoDB client
const dynamoDB = new DynamoDBClient({ region: 'us-east-1' });

export const handler = async (event) => {
    console.log('Received event:', JSON.stringify(event, null, 2));

    try {

        const id = event.id;
        const task = event.task;
        const status = event.status || 'pending';
        console.log("id: " + id + "task: " + task + "Status: " + status);

        if (!task) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: "Task is required." }),
            };
        }

        // Prepare the DynamoDB PutItemCommand
        const params = {
            TableName: 'ToDoList',
            Item: {
                id: { S: id },
                task: { S: task },
                status: { S: status },
            },
        };

        // Save the item to DynamoDB
        await dynamoDB.send(new PutItemCommand(params));

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'TODO item created successfully',
                item: { id, task, status },
            }),
        };
    } catch (error) {
        console.error('Error adding TODO item:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Error adding TODO item', error: error.message }),
        };
    }
};
