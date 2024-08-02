#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";

import { DatabaseStack } from "../lib/database-stack";
import { ComputerStack } from "../lib/compute-stack";
import { AuthStack } from "../lib/auth-stack";

const app = new cdk.App();
const databaseStack = new DatabaseStack(app, "DatabaseStack");
const computeStack = new ComputerStack(app, "ComputerStack", { userTable: databaseStack.userTable });
const authStack = new AuthStack(app, "AuthStack", { addUserPostConfirmation: computeStack.addUserToTable });
