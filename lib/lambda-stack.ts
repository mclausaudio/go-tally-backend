import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Table } from 'aws-cdk-lib/aws-dynamodb';

import * as lambda from 'aws-cdk-lib/aws-lambda';

export interface LambdaStackProps extends StackProps {
  ddbTable: Table;
}

export class LambdaStack extends Stack {
  constructor(scope: Construct, id: string, props?: LambdaStackProps) {
    super(scope, id, props);

    // Declare a lambda
    const dynamoLambda = new lambda.Function(this, 'dynamo-lambda-handler', {
      runtime: lambda.Runtime.NODEJS_14_X,      // execution environment
      code: lambda.Code.fromAsset('lambda-source-code'),  // code loaded from the "lambda-source-code" directory
      handler: 'hello.handler',                // file is "hello", function is "handler"
      environment: {
        TABLE_NAME: props?.ddbTable.tableName ? props.ddbTable.tableName : '',
      },
    });

    props?.ddbTable.grantReadWriteData(dynamoLambda);
  }

}