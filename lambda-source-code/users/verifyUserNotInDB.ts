import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult, CognitoIdentity } from 'aws-lambda';
import * as AWS from 'aws-sdk';

const TABLE_NAME = process.env.TABLE_NAME || '';

const db = new AWS.DynamoDB.DocumentClient();


export const handler = async (event: any, context: any, callback: any) => {
  console.log(event)
  const params = {
    TableName: TABLE_NAME,
    Key: {
      PK: `USER#${event.userName}`,
      SK: `METADATA#${event.userName}`,
    },
  };
  console.log(params)

  try {
    const response = await db.get(params).promise();
    if (Object.keys(response).length !== 0) {
      console.log('Username already exists, ', event, response);
      const error = new Error("Username already exists");
      throw error;
    } 
    console.log({
      response: JSON.stringify({
        "response": response
      }),
    })
    return event;
  } catch (error) {
    callback(error, event);
  };

};



// db.get(params) <-- Need to provide a sort key, we are fetching a specific item.
// const params = {
//   TableName: TABLE_NAME,
//   Key: {
//     PK: 'USER#123',
//     SK: 'METADATA#123'
//   }
// };

// db.query(params) <-- If we want to fetch by the PK (in this case a USER), and see ALL of their sort key items (For example, METADATA or INCREMENT), we need to query.
// const params = {
//   TableName: TABLE_NAME,
//   ExpressionAttributeValues: {
//     ":u": "USER#123",
//   },
//   KeyConditionExpression: "PK = :u"
// };