import * as AWS from 'aws-sdk';

const TABLE_NAME = process.env.TABLE_NAME || '';
// const PRIMARY_KEY = process.env.PRIMARY_KEY || '';

const db = new AWS.DynamoDB.DocumentClient();

export const handler = async (event: any = {}): Promise<any> => {
  console.log(event)
  const userId = event.pathParameters.userId;
  if (!userId) {
    return { statusCode: 400, body: `Error: You are missing the path parameter id` };
  }

  const params = {
    TableName: TABLE_NAME,
    Key: {
      PK: `USER#${userId}`,
      SK: `METADATA#${userId}`
    }
  }

  try {
    const response = await db.get(params).promise();
    if (response.Item) {
      return { statusCode: 200, body: JSON.stringify(response.Item) };
    } else {
      return { statusCode: 404 };
    }
  } catch (dbError) {
    return { statusCode: 500, body: JSON.stringify(dbError) };
  }
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