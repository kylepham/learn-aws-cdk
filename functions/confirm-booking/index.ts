import { DynamoDBClient, GetItemCommand } from "@aws-sdk/client-dynamodb";
import { EventBridgeClient, PutEventsCommand } from "@aws-sdk/client-eventbridge";
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from "aws-lambda";

const ddbClient = new DynamoDBClient({
  region: "us-west-1",
});

export const handler: APIGatewayProxyHandler = async (event, context) => {
  console.log("[confirm-booking] context:", context);
  console.log("[confirm-booking] event: ", event);
  console.log("[confirm-booking] cognitoIdentityId:", context.identity?.cognitoIdentityId);

  try {
    switch (event.httpMethod) {
      case "POST":
        const postReponse = await createRegisterBookingEvent(event);
        return postReponse;
      default:
        return {
          statusCode: 400,
          body: JSON.stringify(""),
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "*",
          },
        };
    }
  } catch (error: any) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify(error.message),
    };
  }
};

const eventBridgeClient = new EventBridgeClient({
  region: "us-west-1",
});

const createRegisterBookingEvent = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log(event);

  if (!event.body)
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: "No body sent!",
      }),
    };

  try {
    const body = JSON.parse(event.body);
    const { flightId, seats, username } = body;

    if (!flightId || !Array.isArray(seats) || !username) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: "Missing required fields!",
        }),
      };
    }

    const availabilities = await Promise.all(seats.map((seatId) => getAvailability(flightId, seatId)));
    if (availabilities.includes("true")) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: "One or more seats are already booked!",
        }),
      };
    }

    const putEventCommand = new PutEventsCommand({
      Entries: [
        {
          Source: "bookFlight",
          DetailType: "flightBooked",
          EventBusName: "FlightBookingEventBus",
          Detail: JSON.stringify({
            flightId,
            seats,
            username,
          }),
        },
      ],
    });
    await eventBridgeClient.send(putEventCommand);

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
      },
      body: JSON.stringify({
        message: "Confirmed booking successfully!",
      }),
    };
  } catch (error) {
    console.error("Error when booking flight", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Internal error occurred",
      }),
    };
  }
};

const getAvailability = async (flightId: string, seatId: string) => {
  try {
    const command = new GetItemCommand({
      TableName: "Seat",
      Key: {
        FlightId: { S: flightId },
        SeatId: { S: seatId },
      },
    });

    const response = await ddbClient.send(command);
    return response.Item?.isBooked.S ?? "";
  } catch (error) {
    throw error;
  }
};
