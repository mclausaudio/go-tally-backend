import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';

import * as lambda from 'aws-cdk-lib/aws-lambda';

export class LambdaStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // Declare a lambda
    const dynamoLambda = new lambda.Function(this, 'dynamo-lambda-handler', {
      runtime: lambda.Runtime.NODEJS_14_X,      // execution environment
      code: lambda.Code.fromAsset('lambda-source-code'),  // code loaded from the "lambda-source-code" directory
      handler: 'hello.handler',                // file is "hello", function is "handler"
    });
  }

}