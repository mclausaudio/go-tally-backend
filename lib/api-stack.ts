import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as cdk from 'aws-cdk-lib';
import { RestApi, AuthorizationType, CognitoUserPoolsAuthorizer } from 'aws-cdk-lib/aws-apigateway';
import { UserPool, UserPoolClient } from 'aws-cdk-lib/aws-cognito';
export interface APIStackProps extends StackProps {
  cognitoUserPool: UserPool,
  cognitoUserPoolClient: UserPoolClient,
}
export class APIStack extends Stack {
  public readonly restApi: RestApi;
  constructor(scope: Construct, id: string, props: APIStackProps) {
    super(scope, id, props);

    const authorizer = new CognitoUserPoolsAuthorizer(this, 'crud-authorizer', {
      cognitoUserPools: [props.cognitoUserPool]
    });

    // Define HTTP API
    const restApi = new RestApi(this, 'backend-api', {
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
      defaultMethodOptions: {
        authorizationType: AuthorizationType.COGNITO,
        authorizer,
      }
    })
    this.restApi = restApi;

    new cdk.CfnOutput(this, 'apiUrl', { value: restApi.url });
  }
}
