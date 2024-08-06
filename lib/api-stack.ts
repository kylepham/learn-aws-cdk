import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import {
  AuthorizationType,
  CognitoUserPoolsAuthorizer,
  Cors,
  LambdaIntegration,
  MethodOptions,
  RestApi,
} from "aws-cdk-lib/aws-apigateway";
import { IUserPool } from "aws-cdk-lib/aws-cognito";

interface APIStackProps extends cdk.StackProps {
  confirmBookingLambdaIntegration: LambdaIntegration;
  userPool: IUserPool;
}

export class APIStack extends cdk.Stack {
  public readonly api: RestApi;

  constructor(scope: Construct, id: string, props: APIStackProps) {
    super(scope, id, props);

    this.api = this._api(props);
    this._output();
  }

  _api(props: APIStackProps) {
    const api = new RestApi(this, "LearnAWSCDKAPI", {
      restApiName: "LearnAWSCDKAPI",
      defaultCorsPreflightOptions: {
        allowOrigins: Cors.ALL_ORIGINS,
        allowMethods: Cors.ALL_METHODS,
        allowHeaders: ["*"],
      },
    });

    const authorizer = new CognitoUserPoolsAuthorizer(this, "BookingAuthorizer", {
      cognitoUserPools: [props.userPool],
      identitySource: "method.request.header.Authorization",
    });
    const methodOptions: MethodOptions = {
      authorizationType: AuthorizationType.COGNITO,
      authorizer,
    };
    authorizer._attachToApi(api);

    const bookingResources = api.root.addResource("booking"); // route /booking
    bookingResources.addMethod("POST", props.confirmBookingLambdaIntegration, methodOptions);

    return api;
  }

  _output() {
    new cdk.CfnOutput(this, "API Endpoint", {
      value: this.api.url,
    });
  }
}
