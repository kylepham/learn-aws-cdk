import { DynamoDBClient, QueryCommand } from "@aws-sdk/client-dynamodb";
import { SESv2Client, SendEmailCommand } from "@aws-sdk/client-sesv2";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import { EventBridgeHandler } from "aws-lambda";

import { SESStack } from "../../lib/ses-stack";

const sesClient = new SESv2Client({
  region: "us-west-1",
});

const ddbClient = new DynamoDBClient({
  region: "us-west-1",
});

export const handler: EventBridgeHandler<
  string,
  {
    flightId: string;
    seats: string[];
    username: string;
  },
  void
> = async (event) => {
  const { flightId, seats } = event.detail;
  const senderEmail = process.env.AWS_VERIFIED_SENDER_EMAIL;
  const userData = await getUser(event.detail.username);
  const recipientEmail = userData[0].email;

  console.log(recipientEmail);

  try {
    const response = await sesClient.send(
      new SendEmailCommand({
        FromEmailAddress: senderEmail,
        Content: {
          Template: {
            TemplateName: SESStack.CONFIRM_BOOKING_EMAIL_TEMPLATE_NAME,
            TemplateData: JSON.stringify({
              flightId,
              seats,
            }),
          },
        },
        Destination: {
          ToAddresses: [recipientEmail],
        },
      })
    );
    console.log({ response });
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const getUser = async (username: string) => {
  const command = new QueryCommand({
    TableName: "User",
    IndexName: "usernameIndex",
    KeyConditionExpression: "#DDB_username = :pkey",
    ExpressionAttributeNames: {
      "#DDB_username": "username",
    },
    ExpressionAttributeValues: {
      ":pkey": { S: username },
    },
  });

  try {
    const response = await ddbClient.send(command);
    return (response.Items || []).map((i) => unmarshall(i)) as any;
  } catch (error) {
    throw error;
  }
};
