import * as cdk from "aws-cdk-lib";
import { CfnTemplate } from "aws-cdk-lib/aws-ses";
import { Construct } from "constructs";

import confirmBookingEmailHtmlTemplate from "../static/confirm-booking-email-html-template";

export class SESStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    new CfnTemplate(this, "ConfirmBookingEmailTemplate", {
      template: {
        templateName: "ConfirmBookingEmailTemplate",
        htmlPart: confirmBookingEmailHtmlTemplate,
        subjectPart: "✈️ Your booking has been confirmed!",
      },
    });
  }
}
