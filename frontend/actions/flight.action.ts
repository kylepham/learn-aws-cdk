// Usage: AWS_PROFILE=fbs npx ts-node ./script.ts
// Make sure to have @aws-sdk/util-dynamodb and @aws-sdk/client-dynamodb modules installed!
// You can use following command to do so: npm install @aws-sdk/client-dynamodb @aws-sdk/util-dynamodb --save
import { DynamoDBClient, ScanCommand, QueryCommand } from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";

const client = new DynamoDBClient({
  region: "us-west-1",
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY as string,
  },
});

const flightTableName = "Flight";

export interface FlightType {
  Origin: string;
  Destination: string;
  FlightId: string;
  DepartureTime: Date;
  ArrivalTime: Date;
}
export const fetchFlights = async (limit: number = 10): Promise<FlightType[]> => {
  const command = new ScanCommand({
    TableName: flightTableName,
    Limit: limit,
  });
  try {
    const response = await client.send(command);

    // Unmarshalling DynamoDB items into JS objects and casting to TS types
    return (response.Items || []).map((i) => unmarshall(i)) as FlightType[];
  } catch (error) {
    console.error(`Failed to fetch data from DynamoDB. Error: ${JSON.stringify(error, null, 2)}`);

    throw error;
  }
};
export interface SeatDataType {
  SeatId: string;
  isBooked: string;
  FlightId: string;
}
const seatTableName = "Seat";

export const fetchSeats = async (flightId: string): Promise<SeatDataType[]> => {
  const command = new QueryCommand({
    TableName: seatTableName,
    KeyConditionExpression: "#DDB_FlightId = :pkey",
    ExpressionAttributeNames: {
      "#DDB_FlightId": "FlightId",
    },
    ExpressionAttributeValues: {
      ":pkey": { S: flightId },
    },
    Limit: 42,
  });
  try {
    const response = await client.send(command);

    // Unmarshalling DynamoDB items into JS objects and casting to TS types
    return (response.Items || []).map((i) => unmarshall(i)) as SeatDataType[];
  } catch (error) {
    console.error(`Failed to fetch data from DynamoDB. Error: ${JSON.stringify(error, null, 2)}`);

    throw error;
  }
};
