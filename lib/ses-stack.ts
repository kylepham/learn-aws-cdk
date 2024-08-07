import * as cdk from "aws-cdk-lib";
import * as ses from "aws-cdk-lib/aws-ses";
import { Construct } from "constructs";

import confirmBookingEmailHtmlTemplate from "../static/confirm-booking-email-html-template";

export class SESStack extends cdk.Stack {
  static readonly CONFIRM_BOOKING_EMAIL_TEMPLATE_NAME = "ConfirmBookingEmailTemplate";
  readonly sesEmailIdentity: ses.EmailIdentity;
  readonly sesEmailTemplate: ses.CfnTemplate;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    this.sesEmailIdentity = new ses.EmailIdentity(this, "sesEmailIdentity", {
      identity: ses.Identity.email(process.env.AWS_VERIFIED_SENDER_EMAIL ?? ""),
    });

    this.sesEmailTemplate = new ses.CfnTemplate(this, SESStack.CONFIRM_BOOKING_EMAIL_TEMPLATE_NAME, {
      template: {
        templateName: SESStack.CONFIRM_BOOKING_EMAIL_TEMPLATE_NAME,
        htmlPart: confirmBookingEmailHtmlTemplate,
        subjectPart: "✈️ Your booking has been confirmed!",
      },
    });
  }
}
