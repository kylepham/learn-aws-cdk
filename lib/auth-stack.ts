import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { aws_cognito as Cognito } from "aws-cdk-lib";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";

interface AuthStackProps extends cdk.StackProps {
  addUserPostConfirmation: NodejsFunction;
}

export class AuthStack extends cdk.Stack {
  public readonly userPool: Cognito.UserPool;
  public readonly userPoolClient: Cognito.UserPoolClient;

  constructor(scope: Construct, id: string, props: AuthStackProps) {
    super(scope, id, props);

    this.userPool = this._createUserPool(props);
    this.userPoolClient = this._createUserPoolClient();
    this._output();
  }

  _createUserPool(props: AuthStackProps) {
    return new Cognito.UserPool(this, "LearnAWSCDKUserPool", {
      userPoolName: "LearnAWSCDKUserPool",
      selfSignUpEnabled: true,
      signInAliases: {
        email: true,
      },
      autoVerify: {
        email: true,
      },
      passwordPolicy: {
        minLength: 8,
        requireLowercase: false,
        requireUppercase: false,
        requireDigits: false,
        requireSymbols: false,
      },
      standardAttributes: {
        email: {
          required: true,
          mutable: true,
        },
      },
      customAttributes: {
        name: new Cognito.StringAttribute({
          minLen: 3,
          maxLen: 20,
        }),
      },
      lambdaTriggers: {
        postConfirmation: props.addUserPostConfirmation,
      },
    });
  }

  _createUserPoolClient() {
    return new Cognito.UserPoolClient(this, "LearnAWSCDKUserPoolClient", {
      userPool: this.userPool,
      authFlows: {
        userPassword: true,
        /**
         * https://en.wikipedia.org/wiki/Secure_Remote_Password_protocol
         * A zero-knowledge password proof from the user to the server, verifying client without the server learning about the password.
         */
        userSrp: true,
      },
    });
  }

  _output() {
    new cdk.CfnOutput(this, "LearnAWSCDKUserPoolIdOutput", {
      value: this.userPool.userPoolId,
    });
    new cdk.CfnOutput(this, "LearnAWSCDKUserPoolClientIdOutput", {
      value: this.userPoolClient.userPoolClientId,
    });
  }
}
