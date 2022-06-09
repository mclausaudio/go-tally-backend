import { Stack, StackProps, CfnOutput, RemovalPolicy } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { UserPool, UserPoolClient, VerificationEmailStyle } from 'aws-cdk-lib/aws-cognito';
import { getDiffieHellman } from 'crypto';



export class CognitoStack extends Stack {
  // public readonly cognitoUserPool: UserPool;
  // public readonly cognitoUserPoolClient: UserPoolClient;
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

  //   const userPool = new UserPool(this, 'user-pool', {
  //     userPoolName: 'user-pool',
  //     signInAliases: {email: true},
  //     removalPolicy: RemovalPolicy.DESTROY
  //   });
  //   this.cognitoUserPool = userPool;

  //   const userPoolClient = new UserPoolClient(this, 'user-pool-client', {
  //     userPool,
  //     authFlows: {
  //       userPassword: true,
  //     },
  //   });
  //   this.cognitoUserPoolClient = userPoolClient;

  //   new CfnOutput(this, 'UserPoolArn', { value: userPool.userPoolArn });
  //   new CfnOutput(this, 'UserPoolProviderURL', { value: userPool.userPoolProviderUrl });
  //   new CfnOutput(this, 'UserPoolClientId', { value: userPoolClient.userPoolClientId });
  }
}
