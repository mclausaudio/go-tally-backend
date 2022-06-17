import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';
import * as AWS from 'aws-sdk';

const TABLE_NAME = process.env.TABLE_NAME || '';
// const PRIMARY_KEY = process.env.PRIMARY_KEY || '';

const db = new AWS.DynamoDB.DocumentClient();

// interface Params {
//   TableName: string;
//   Item: {
//     PK: string,
//     SK: string,
//     City: String,
//     ReturnValues: "ALL_NEW" // In order to have response object returned
//     Expected: 
//   }
// };

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const body = event.body ? JSON.parse(event.body) : {};
  console.log("Body", body);
  const params = {
    TableName: TABLE_NAME,
    Item: body,
    ReturnValues: "ALL_OLD",
    // ONLY create a user, if PK (USER#123) do not exist,  If they already exist, already a user
    ConditionExpression: "attribute_not_exists(PK)"
  };

  

  try {
    const response = await db.put(params).promise();
    return {
      statusCode: 200,
      body: JSON.stringify({
        "event": event,
        "response": response}),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify(error),
    };
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