import { type PostConfirmationConfirmSignUpTriggerEvent } from "aws-lambda";
import { ulid } from "ulidx";
import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";

const client = new DynamoDBClient({
  region: "us-west-1",
});

export const handler = async (event: PostConfirmationConfirmSignUpTriggerEvent) => {
  const id = ulid();
  const date = new Date();
  const isoDate = date.toISOString();

  console.log("Event ", JSON.stringify(event, null, 2));

  const item = {
    UserId: id,
    createdAt: isoDate,
    email: event.request.userAttributes.email,
    name: event.request.userAttributes.name,
    username: event.userName,
  };

  const command = new PutItemCommand({
    TableName: "User",
    Item: marshall(item),
    ConditionExpression: "attribute_not_exists(UserId) AND attribute_not_exists(email)",
  });

  try {
    await client.send(command);
    return event;
  } catch (error) {
    throw error;
  }
};
