import * as dotenv from "dotenv";
import * as path from "path";
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

import * as Cognito from "@aws-sdk/client-cognito-identity-provider";
import createMockUser from "./utils/create-mock-user";

const cognitoClient = new Cognito.CognitoIdentityProviderClient({
  region: "us-west-1",
});

describe("AuthFlow Test", () => {
  let name: string | undefined,
    email: string | undefined,
    password: string | undefined,
    userPoolId: string | undefined,
    userPoolClientId: string | undefined;

  beforeAll(() => {
    const user = createMockUser();

    name = user.name;
    email = user.email;
    password = user.password;
    userPoolId = process.env.USER_POOL_ID;
    userPoolClientId = process.env.USER_POOL_CLIENT_ID;
  });

  it("should be able to receive user sub (id) and access token", async () => {
    console.log(`(1) signing up ${email}...`);
    const signUpCommand = new Cognito.SignUpCommand({
      ClientId: userPoolClientId,
      Username: email,
      Password: password,
      UserAttributes: [
        {
          Name: "name",
          Value: name,
        },
      ],
    });
    const signUpResponse = await cognitoClient.send(signUpCommand).catch((err) => {
      console.error(err);
      throw err;
    });
    const userSub = signUpResponse.UserSub; // `UserSub` is the User Id generated by Cognito
    expect(userSub).toBeDefined();

    console.log(`(2) confirming signup for email ${email} with user sub (id) ${userSub}`);
    const adminConfirmSignUpCommand = new Cognito.AdminConfirmSignUpCommand({
      UserPoolId: userPoolId,
      Username: userSub,
    });
    const adminConfirmSignUpResponse = await cognitoClient.send(adminConfirmSignUpCommand).catch((err) => {
      console.error(err);
      throw err;
    });
    expect(adminConfirmSignUpResponse.$metadata.httpStatusCode).toBe(200);
  });
});