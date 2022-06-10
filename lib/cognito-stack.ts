import { Stack, StackProps, CfnOutput, RemovalPolicy } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { UserPool, UserPoolClient, UserPoolClientIdentityProvider, VerificationEmailStyle, StringAttribute, AccountRecovery, ClientAttributes } from 'aws-cdk-lib/aws-cognito';



export class CognitoStack extends Stack {
  public readonly cognitoUserPool: UserPool;
  public readonly cognitoUserPoolClient: UserPoolClient;
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // User Pool - https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_cognito.UserPoolProps.html
    const userPool = new UserPool(this, 'go-tally-user-pool', {
      userPoolName: 'go-tally-user-pool',
      selfSignUpEnabled: true,
      signInAliases: {
        username: true,
        email: true,
      },
      autoVerify: {
        email: true
      },
      standardAttributes: {
        givenName: {
          required: true,
          mutable: true,
        },
      },
      accountRecovery: AccountRecovery.EMAIL_ONLY,
      removalPolicy: RemovalPolicy.RETAIN,
    });
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
