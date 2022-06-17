import { Stack, StackProps, CfnOutput, RemovalPolicy } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { UserPool, UserPoolClient, UserPoolClientIdentityProvider, AccountRecovery, ClientAttributes, UserPoolOperation } from 'aws-cdk-lib/aws-cognito';

import { Table } from 'aws-cdk-lib/aws-dynamodb';
import * as lambda from 'aws-cdk-lib/aws-lambda';

export interface CognitoProps extends StackProps {
  ddbTable: Table,
}


export class CognitoStack extends Stack {
  public readonly cognitoUserPool: UserPool;
  public readonly cognitoUserPoolClient: UserPoolClient;
  constructor(scope: Construct, id: string, props: CognitoProps) {
    super(scope, id, props);

    const verifyUserNotInDB = new lambda.Function(this, 'verify-user-not-in-db-lambda-handler', {
      runtime: lambda.Runtime.NODEJS_14_X,
      code: lambda.Code.fromAsset('lambda-source-code/users/'),
      handler: 'verifyUserNotInDB.handler',
      environment: {
        TABLE_NAME: props.ddbTable.tableName ? props.ddbTable.tableName : '',
      },
    });
    props.ddbTable.grantReadWriteData(verifyUserNotInDB);
    
    // We create this lambda to write user data to DB, for the userPools POST_CONFIRMATION trigger
    const createUser = new lambda.Function(this, 'create-user-lambda-handler', {
      runtime: lambda.Runtime.NODEJS_14_X,
      code: lambda.Code.fromAsset('lambda-source-code/users/'),
      handler: 'createUser.handler',
      environment: {
        TABLE_NAME: props.ddbTable.tableName ? props.ddbTable.tableName : '',
      },
    });
    props.ddbTable.grantReadWriteData(createUser);

    // User Pool - https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_cognito.UserPoolProps.html
    const userPool = new UserPool(this, 'go-tally-user-pool', {
      userPoolName: 'go-tally-user-pool',
      selfSignUpEnabled: true,
      signInAliases: {
        username: true,
        preferredUsername: true
      },
      autoVerify: {
        email: true
      },
      standardAttributes: {
        preferredUsername: {
          required: false,
          mutable: true
        },
        email: {
          required: true,
          mutable: true
        }
      },
      accountRecovery: AccountRecovery.EMAIL_ONLY,
      removalPolicy: RemovalPolicy.RETAIN,
    });
    // Add lambdaTrigger to make sure user doesn't already exist in DB
    userPool.addTrigger(UserPoolOperation.PRE_SIGN_UP, verifyUserNotInDB);
    //  Add lambdaTrigger to add user data to DynamoDB
    userPool.addTrigger(UserPoolOperation.POST_CONFIRMATION, createUser);
    
    this.cognitoUserPool = userPool;
  
    const standardCognitoAttributes = {
      givenName: true,
      familyName: true,
      email: true,
      emailVerified: true,
      address: true,
      birthdate: true,
      gender: true,
      locale: true,
      middleName: true,
      fullname: true,
      nickname: true,
      phoneNumber: true,
      phoneNumberVerified: true,
      profilePicture: true,
      preferredUsername: true,
      profilePage: true,
      timezone: true,
      lastUpdateTime: true,
      website: true,
    };

    const clientReadAttributes = new ClientAttributes()
      .withStandardAttributes(standardCognitoAttributes)

    const clientWriteAttributes = new ClientAttributes()
      .withStandardAttributes({
        ...standardCognitoAttributes,
        emailVerified: false,
        phoneNumberVerified: false,
      })

    // User Pool Client
    const userPoolClient = new UserPoolClient(this, 'userpool-client', {
      userPool,
      authFlows: {
        userPassword: true
      },
      supportedIdentityProviders: [
        UserPoolClientIdentityProvider.COGNITO,
      ],
    });
    this.cognitoUserPoolClient = userPoolClient;

    new CfnOutput(this, 'UserPoolArn', { value: userPool.userPoolArn });
    new CfnOutput(this, 'UserPoolProviderURL', { value: userPool.userPoolProviderUrl });
    new CfnOutput(this, 'userPoolId', { value: userPool.userPoolId });
    new CfnOutput(this, 'UserPoolClientId', { value: userPoolClient.userPoolClientId });
  }
}
