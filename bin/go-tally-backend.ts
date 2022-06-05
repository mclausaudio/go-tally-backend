#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { DynamoDBStack } from '../lib/dynamodb-stack';
import { LambdaStack } from '../lib/lambda-stack';

const app = new cdk.App();

new DynamoDBStack(app, 'GoTallyDynamoDBStack', {});
new LambdaStack(app, 'GoTallyLambdaStack', {});