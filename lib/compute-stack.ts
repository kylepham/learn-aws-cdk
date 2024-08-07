import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { Table } from "aws-cdk-lib/aws-dynamodb";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import * as path from "path";
import * as iam from "aws-cdk-lib/aws-iam";
import { LambdaIntegration } from "aws-cdk-lib/aws-apigateway";
import { EventBus, Rule } from "aws-cdk-lib/aws-events";
import { LambdaFunction } from "aws-cdk-lib/aws-events-targets";

interface ComputeStackProps extends cdk.StackProps {
  flightBookingEventBusArn: string;
  userTable: Table;
  seatTable: Table;
}

export class ComputeStack extends cdk.Stack {
  readonly addUserToTable: NodejsFunction;
  readonly confirmBookingLambdaIntegration: LambdaIntegration;
  readonly registerBooking: NodejsFunction;
  readonly sendConfirmBookingEmail: NodejsFunction;

  constructor(scope: Construct, id: string, props: ComputeStackProps) {
    super(scope, id, props);

    this.addUserToTable = this._addUserToTable(props);
    this.confirmBookingLambdaIntegration = this._confirmBookingLambdaIntegration(props);
    this.registerBooking = this._registerBooking(props);
    this.sendConfirmBookingEmail = this._sendConfirmBookingEmail(props);

    // reconstruct eventbus object & add rules (avoid cyclic reference)
    const eventBus = EventBus.fromEventBusArn(this, "sad", props.flightBookingEventBusArn);
    new Rule(this, "FlightBookingEventBusRule", {
      eventBus,
      eventPattern: {
        source: ["bookFlight"],
        detailType: ["flightBooked"],
      },
      targets: [new LambdaFunction(this.registerBooking), new LambdaFunction(this.sendConfirmBookingEmail)],
    });
  }

  _addUserToTable(props: ComputeStackProps) {
    const func = new NodejsFunction(this, "addUserFunction", {
      functionName: "addUserFunction",
      runtime: Runtime.NODEJS_18_X,
      handler: "handler",
      entry: path.join(__dirname, "../functions/add-user-post-confirmation/index.ts"),
    });
    func.addToRolePolicy(
      new iam.PolicyStatement({
        actions: ["dynamodb:PutItem"],
        resources: [props.userTable.tableArn as string],
      })
    );

    return func;
  }

  _confirmBookingLambdaIntegration(props: ComputeStackProps) {
    const func = new NodejsFunction(this, "confirmBookingFunction", {
      functionName: "confirmBookingFunction",
      runtime: Runtime.NODEJS_18_X,
      handler: "handler",
      entry: path.join(__dirname, "../functions/confirm-booking/index.ts"),
    });
    func.addToRolePolicy(
      new iam.PolicyStatement({
        actions: ["dynamodb:*", "events:PutEvents"],
        resources: [props.seatTable.tableArn, props.flightBookingEventBusArn],
      })
    );

    return new LambdaIntegration(func);
  }

  _registerBooking(props: ComputeStackProps) {
    const func = new NodejsFunction(this, "registerBookingFunction", {
      functionName: "registerBookingFunction",
      runtime: Runtime.NODEJS_18_X,
      handler: "handler",
      entry: path.join(__dirname, `../functions/register-booking/index.ts`),
    });
    func.addToRolePolicy(
      new iam.PolicyStatement({
        actions: ["dynamodb:*"],
        resources: [props.seatTable.tableArn],
      })
    );

    return func;
  }

  _sendConfirmBookingEmail(props: ComputeStackProps) {
    const func = new NodejsFunction(this, "sendConfirmBookingEmailFunction", {
      functionName: "sendConfirmBookingEmailFunction",
      runtime: Runtime.NODEJS_18_X,
      handler: "handler",
      entry: path.join(__dirname, `../functions/send-confirm-booking-email/index.ts`),
      environment: {
        AWS_VERIFIED_SENDER_EMAIL: process.env.AWS_VERIFIED_SENDER_EMAIL ?? "",
      },
    });
    func.addToRolePolicy(
      new iam.PolicyStatement({
        actions: ["dynamodb:Query", "ses:SendTemplatedEmail"],
        resources: [props.userTable.tableArn, `${props.userTable.tableArn}/index/*`, `arn:aws:ses:us-west-1:*:*`],
      })
    );

    return func;
  }
}
