#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { DynamoDBStack } from '../lib/dynamodb-stack';
import { LambdaStack } from '../lib/lambda-stack';
import { APIStack } from '../lib/api-stack';
import { CognitoStack } from '../lib/cognito-stack';

const app = new cdk.App();

const dynamoDBStack = new DynamoDBStack(app, 'GoTallyDynamoDBStack', {});
const cognitoStack = new CognitoStack(app, 'GoTallyCognitoStack', {});
const apiStack = new APIStack(app, 'GoTallyBackEndAPI', {
  cognitoUserPool: cognitoStack.cognitoUserPool,
  cognitoUserPoolClient: cognitoStack.cognitoUserPoolClient
});
const lambdaStack = new LambdaStack(app, 'GoTallyLambdaStack', { 
  ddbTable: dynamoDBStack.primaryTable,
  restApi: apiStack.restApi
});