const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, PutCommand, GetCommand } = require('@aws-sdk/lib-dynamodb');

const dynamoDbClient = new DynamoDBClient({ region: process.env.AWS_REGION });
const ddbDocClient = DynamoDBDocumentClient.from(dynamoDbClient);

// Generate a random 4-digit alphanumerica case-sensitive key to be used as DB primary key
const generateShortKey = (length) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
};

// Function to ensure the key is unique
const isKeyUnique = async (key) => {
    try{
        await getClipboardData(key);
        return false;
    } catch (error) {
        console.log("Key is unique");
        return true;
    }
}


const saveClipboardData = async (data, files) => {

    let key;
    do {
        key = generateShortKey(4);  // Generate a 4-digit key
    } while (!isKeyUnique(key));  // Ensure the key is unique

    const command = new PutCommand({
        TableName: process.env.DYNAMODB_TABLE_NAME,
        Item: {
            id: key,
            data,
            files,
            createdAt: Date.now(),
        },
    });

    try {
        await ddbDocClient.send(command);
        return key;
    } catch (error) {
        console.error('Error saving clipboard data to DynamoDB:', error);
        throw new Error('Error saving clipboard data');
    }
};

const getClipboardData = async (key) => {
    const command = new GetCommand({
        TableName: process.env.DYNAMODB_TABLE_NAME,
        Key: {
            id: key,
        },
    });

    try {
        const result = await ddbDocClient.send(command);
        return result.Item;
    } catch (error) {
        console.error('Error retrieving clipboard data from DynamoDB:', error);
        throw new Error('Error retrieving clipboard data');
    }
};

module.exports = { saveClipboardData, getClipboardData };
