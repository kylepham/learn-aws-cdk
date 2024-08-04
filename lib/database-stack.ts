import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { AttributeType, BillingMode, Table } from "aws-cdk-lib/aws-dynamodb";

export class DatabaseStack extends cdk.Stack {
  public readonly userTable: Table;
  public readonly flightTable: Table;
  public readonly seatTable: Table;

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

    this.flightTable = new Table(this, "FlightTable", {
      partitionKey: {
        name: "FlightId",
        type: AttributeType.STRING,
      },
      tableName: "Flight",
      billingMode: BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    this.seatTable = new Table(this, "SeatTable", {
      partitionKey: {
        name: "FlightId",
        type: AttributeType.STRING,
      },
      sortKey: {
        name: "SeatId",
        type: AttributeType.STRING,
      },
      tableName: "Seat",
      billingMode: BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });
    this.seatTable.addGlobalSecondaryIndex({
      indexName: "isBookedIndex",
      partitionKey: {
        name: "isBooked",
        type: AttributeType.STRING,
      },
    });
  }
}
