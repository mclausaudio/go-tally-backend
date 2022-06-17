import { Stack, StackProps, CfnOutput } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Table } from 'aws-cdk-lib/aws-dynamodb';

import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigw from 'aws-cdk-lib/aws-apigateway';

export interface LambdaStackProps extends StackProps {
  ddbTable: Table,
  restApi: apigw.RestApi
}

export class LambdaStack extends Stack {
  constructor(scope: Construct, id: string, props: LambdaStackProps) {
    super(scope, id, props);

    // Declare a lambda
    const dynamoLambda = new lambda.Function(this, 'get-user-metadata-lambda-handler', {
      runtime: lambda.Runtime.NODEJS_14_X,      // execution environment
      code: lambda.Code.fromAsset('lambda-source-code'),  // code loaded from the "lambda-source-code" directory
      handler: 'get-user-metadata.handler',                // file is "hello", function is "handler"
      environment: {
        TABLE_NAME: props.ddbTable.tableName ? props.ddbTable.tableName : '',
      },
    });
    props.ddbTable.grantReadWriteData(dynamoLambda);
    
    const restApi = props.restApi;
    restApi.root.addMethod("ANY");
    const users = restApi.root.addResource('users');
    const user = users.addResource('{userId}')
    // integrate GET /todos with getTodosLambda
    // user.addMethod(
    //   'GET',
    //   new apigw.LambdaIntegration(dynamoLambda, { proxy: true }),
    // );
  }

}