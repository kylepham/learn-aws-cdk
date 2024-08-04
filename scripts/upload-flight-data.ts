import * as dotenv from "dotenv";
import * as path from "path";
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

import { DynamoDB } from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";

// Initialize DynamoDB client
const dynamodb = new DynamoDB({
  region: "us-west-1",
});

const tableName = "Flight";

// Sample data
const data = [
  {
    FlightId: "FL123",
    Origin: "Mumbai",
    Destination: "Los Angeles",
    DepartureTime: "2023-07-01T08:00:00",
    ArrivalTime: "2023-07-01T11:00:00",
  },
  {
    FlightId: "FL456",
    Origin: "Bengaluru",
    Destination: "Miami",
    DepartureTime: "2023-07-02T09:30:00",
    ArrivalTime: "2023-07-02T12:30:00",
  },
];

// Insert data into DynamoDB table
const putItems = async () => {
  for (const item of data) {
    const params = {
      TableName: tableName,
      Item: marshall(item),
    };

    try {
      await dynamodb.putItem(params);
      console.log(`Successfully added item: ${JSON.stringify(item)}`);
    } catch (error) {
      console.error(`Error adding item: ${JSON.stringify(item)} - ${error}`);
    }
  }
};

putItems();
