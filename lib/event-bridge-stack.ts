import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { EventBus } from "aws-cdk-lib/aws-events";

interface EventBridgeStackProps extends cdk.StackProps {}

export class EventBridgeStack extends cdk.Stack {
  public readonly flightBookingEventBus: EventBus;

  constructor(scope: Construct, id: string, props?: EventBridgeStackProps) {
    super(scope, id, props);

    this.flightBookingEventBus = new EventBus(this, "FlightBookingEventBus", {
      eventBusName: "FlightBookingEventBus",
    });
  }
}
