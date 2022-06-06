#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { DynamoDBStack } from '../lib/dynamodb-stack';
import { LambdaStack } from '../lib/lambda-stack';

const app = new cdk.App();

const dynamoDBStack = new DynamoDBStack(app, 'GoTallyDynamoDBStack', {});
const lambdaStack = new LambdaStack(app, 'GoTallyLambdaStack', { 
  ddbTable: dynamoDBStack.primaryTable
});