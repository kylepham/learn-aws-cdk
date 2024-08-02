import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { Table } from "aws-cdk-lib/aws-dynamodb";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import * as path from "path";
import * as iam from "aws-cdk-lib/aws-iam";

interface ComputeStackProps extends cdk.StackProps {
  userTable: Table;
}

export class ComputerStack extends cdk.Stack {
  readonly addUserToTable: NodejsFunction;

  constructor(scope: Construct, id: string, props: ComputeStackProps) {
    super(scope, id, props);

    this.addUserToTable = this._addUserToTable(props);
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
        actions: ["dynamo:PutItem"],
        resources: [props.userTable.tableArn as string],
      })
    );

    return func;
  }
}
