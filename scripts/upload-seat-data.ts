import * as dotenv from "dotenv";
import * as path from "path";
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

import { DynamoDB } from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";

// Initialize DynamoDB client
const dynamodb = new DynamoDB({
  region: "us-west-1",
});

const tableName = "Seat";

// Sample data
const data = [
  { FlightId: "FL123", SeatId: "1A", isBooked: "false" },
  { FlightId: "FL123", SeatId: "1B", isBooked: "false" },
  { FlightId: "FL123", SeatId: "1C", isBooked: "false" },
  { FlightId: "FL123", SeatId: "1D", isBooked: "false" },
  { FlightId: "FL123", SeatId: "1E", isBooked: "false" },
  { FlightId: "FL123", SeatId: "1F", isBooked: "false" },
  { FlightId: "FL123", SeatId: "2A", isBooked: "false" },
  { FlightId: "FL123", SeatId: "2B", isBooked: "false" },
  { FlightId: "FL123", SeatId: "2C", isBooked: "false" },
  { FlightId: "FL123", SeatId: "2D", isBooked: "false" },
  { FlightId: "FL123", SeatId: "2E", isBooked: "false" },
  { FlightId: "FL123", SeatId: "2F", isBooked: "false" },
  { FlightId: "FL123", SeatId: "3A", isBooked: "false" },
  { FlightId: "FL123", SeatId: "3B", isBooked: "false" },
  { FlightId: "FL123", SeatId: "3C", isBooked: "false" },
  { FlightId: "FL123", SeatId: "3D", isBooked: "false" },
  { FlightId: "FL123", SeatId: "3E", isBooked: "false" },
  { FlightId: "FL123", SeatId: "3F", isBooked: "false" },
  { FlightId: "FL123", SeatId: "4A", isBooked: "false" },
  { FlightId: "FL123", SeatId: "4B", isBooked: "false" },
  { FlightId: "FL123", SeatId: "4C", isBooked: "false" },
  { FlightId: "FL123", SeatId: "4D", isBooked: "false" },
  { FlightId: "FL123", SeatId: "4E", isBooked: "false" },
  { FlightId: "FL123", SeatId: "4F", isBooked: "false" },
  { FlightId: "FL123", SeatId: "5A", isBooked: "false" },
  { FlightId: "FL123", SeatId: "5B", isBooked: "false" },
  { FlightId: "FL123", SeatId: "5C", isBooked: "false" },
  { FlightId: "FL123", SeatId: "5D", isBooked: "false" },
  { FlightId: "FL123", SeatId: "5E", isBooked: "false" },
  { FlightId: "FL123", SeatId: "5F", isBooked: "false" },
  { FlightId: "FL123", SeatId: "6A", isBooked: "false" },
  { FlightId: "FL123", SeatId: "6B", isBooked: "false" },
  { FlightId: "FL123", SeatId: "6C", isBooked: "false" },
  { FlightId: "FL123", SeatId: "6D", isBooked: "false" },
  { FlightId: "FL123", SeatId: "6E", isBooked: "false" },
  { FlightId: "FL123", SeatId: "6F", isBooked: "false" },
  { FlightId: "FL123", SeatId: "7A", isBooked: "false" },
  { FlightId: "FL123", SeatId: "7B", isBooked: "false" },
  { FlightId: "FL123", SeatId: "7C", isBooked: "false" },
  { FlightId: "FL123", SeatId: "7D", isBooked: "false" },
  { FlightId: "FL123", SeatId: "7E", isBooked: "false" },
  { FlightId: "FL123", SeatId: "7F", isBooked: "false" },
  { FlightId: "FL456", SeatId: "1A", isBooked: "false" },
  { FlightId: "FL456", SeatId: "1B", isBooked: "false" },
  { FlightId: "FL456", SeatId: "1C", isBooked: "false" },
  { FlightId: "FL456", SeatId: "1D", isBooked: "false" },
  { FlightId: "FL456", SeatId: "1E", isBooked: "false" },
  { FlightId: "FL456", SeatId: "1F", isBooked: "false" },
  { FlightId: "FL456", SeatId: "2A", isBooked: "false" },
  { FlightId: "FL456", SeatId: "2B", isBooked: "false" },
  { FlightId: "FL456", SeatId: "2C", isBooked: "false" },
  { FlightId: "FL456", SeatId: "2D", isBooked: "false" },
  { FlightId: "FL456", SeatId: "2E", isBooked: "false" },
  { FlightId: "FL456", SeatId: "2F", isBooked: "false" },
  { FlightId: "FL456", SeatId: "3A", isBooked: "false" },
  { FlightId: "FL456", SeatId: "3B", isBooked: "false" },
  { FlightId: "FL456", SeatId: "3C", isBooked: "false" },
  { FlightId: "FL456", SeatId: "3D", isBooked: "false" },
  { FlightId: "FL456", SeatId: "3E", isBooked: "false" },
  { FlightId: "FL456", SeatId: "3F", isBooked: "false" },
  { FlightId: "FL456", SeatId: "4A", isBooked: "false" },
  { FlightId: "FL456", SeatId: "4B", isBooked: "false" },
  { FlightId: "FL456", SeatId: "4C", isBooked: "false" },
  { FlightId: "FL456", SeatId: "4D", isBooked: "false" },
  { FlightId: "FL456", SeatId: "4E", isBooked: "false" },
  { FlightId: "FL456", SeatId: "4F", isBooked: "false" },
  { FlightId: "FL456", SeatId: "5A", isBooked: "false" },
  { FlightId: "FL456", SeatId: "5B", isBooked: "false" },
  { FlightId: "FL456", SeatId: "5C", isBooked: "false" },
  { FlightId: "FL456", SeatId: "5D", isBooked: "false" },
  { FlightId: "FL456", SeatId: "5E", isBooked: "false" },
  { FlightId: "FL456", SeatId: "5F", isBooked: "false" },
  { FlightId: "FL456", SeatId: "6A", isBooked: "false" },
  { FlightId: "FL456", SeatId: "6B", isBooked: "false" },
  { FlightId: "FL456", SeatId: "6C", isBooked: "false" },
  { FlightId: "FL456", SeatId: "6D", isBooked: "false" },
  { FlightId: "FL456", SeatId: "6E", isBooked: "false" },
  { FlightId: "FL456", SeatId: "6F", isBooked: "false" },
  { FlightId: "FL456", SeatId: "7A", isBooked: "false" },
  { FlightId: "FL456", SeatId: "7B", isBooked: "false" },
  { FlightId: "FL456", SeatId: "7C", isBooked: "false" },
  { FlightId: "FL456", SeatId: "7D", isBooked: "false" },
  { FlightId: "FL456", SeatId: "7E", isBooked: "false" },
  { FlightId: "FL456", SeatId: "7F", isBooked: "false" },
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
    } catch (error: any) {
      console.error(`Error adding item: ${JSON.stringify(item)} - ${error.message}`);
    }
  }
};

putItems();
