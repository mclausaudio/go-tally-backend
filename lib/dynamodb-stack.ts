import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';

import * as ddb from 'aws-cdk-lib/aws-dynamodb';

export class DynamoDBStack extends Stack {
  public readonly primaryTable: ddb.Table;
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // Primary DDB Table
    const primaryTable = new ddb.Table(this, 'primary-table', {
      tableName: `go-tally-beta-primary-table`,
      billingMode: ddb.BillingMode.PAY_PER_REQUEST,
      partitionKey: { name: 'PK', type: ddb.AttributeType.STRING },
      sortKey: { name: 'SK', type: ddb.AttributeType.STRING }
    })
    this.primaryTable = primaryTable;

  }
}
