import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as cdk from 'aws-cdk-lib';
import * as apigw from 'aws-cdk-lib/aws-apigateway';


export class APIStack extends Stack {
  public readonly restApi: apigw.RestApi;
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // Define HTTP API
    const restApi = new apigw.RestApi(this, 'backend-api', {
      description: 'API Gateway for lambdas that interact with dynamo table',
      deployOptions: {
        stageName: 'beta',
      },
      defaultCorsPreflightOptions: {
        allowHeaders: [
          'Content-Type',
          'X-Amz-Date',
          'Authorization',
          'X-Api-Key',
        ],
        allowMethods: ['OPTIONS', 'GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
        allowCredentials: true,
        allowOrigins: ['*'],
      },
    })
    this.restApi = restApi;

    new cdk.CfnOutput(this, 'apiUrl', { value: restApi.url });
  }
}
