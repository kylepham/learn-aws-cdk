import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { AttributeType, BillingMode, Table } from "aws-cdk-lib/aws-dynamodb";

export class DatabaseStack extends cdk.Stack {
  public readonly userTable: Table;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    this.userTable = new Table(this, "UserTable", {
      partitionKey: {
        name: "UserId",
        type: AttributeType.STRING,
      },
      tableName: "User",
      billingMode: BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });
    this.userTable.addGlobalSecondaryIndex({
      indexName: "usernameIndex",
      partitionKey: {
        name: "username",
        type: AttributeType.STRING,
      },
    });
  }
}
