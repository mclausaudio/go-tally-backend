import * as AWS from 'aws-sdk';

const TABLE_NAME = process.env.TABLE_NAME || '';
// const PRIMARY_KEY = process.env.PRIMARY_KEY || '';

const db = new AWS.DynamoDB.DocumentClient();

export const handler = async (event: any = {}): Promise<any> => {

  // const requestedItemId = event.pathParameters.id;
  // if (!requestedItemId) {
  //   return { statusCode: 400, body: `Error: You are missing the path parameter id` };
  // }

  const params = {
    TableName: TABLE_NAME,
    ExpressionAttributeValues: {
      ":u": "USER#123",
    },
    KeyConditionExpression: "PK = :u"
  }

  try {
    const response = await db.query(params).promise();
    if (response.Items) {
      return { statusCode: 200, body: JSON.stringify(response.Items) };
    } else {
      return { statusCode: 404 };
    }
  } catch (dbError) {
    return { statusCode: 500, body: JSON.stringify(dbError) };
  }
};



// db.get(params) <-- Need to provide a sort get, we are fetching a specific item.
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