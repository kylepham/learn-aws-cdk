#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";

import { DatabaseStack } from "../lib/database-stack";
import { ComputeStack } from "../lib/compute-stack";
import { AuthStack } from "../lib/auth-stack";
import { APIStack } from "../lib/api-stack";
import { EventBridgeStack } from "../lib/event-bridge-stack";

const app = new cdk.App();
const eventBridgeStack = new EventBridgeStack(app, "EventBridgeStack");
const databaseStack = new DatabaseStack(app, "DatabaseStack");
const computeStack = new ComputeStack(app, "ComputeStack", {
  flightBookingEventBusArn: eventBridgeStack.flightBookingEventBus.eventBusArn,
  userTable: databaseStack.userTable,
  seatTable: databaseStack.seatTable,
});
const authStack = new AuthStack(app, "AuthStack", { addUserPostConfirmation: computeStack.addUserToTable });
const apiStack = new APIStack(app, "APIStack", {
  confirmBookingLambdaIntegration: computeStack.confirmBookingLambdaIntegration,
  userPool: authStack.userPool,
});
