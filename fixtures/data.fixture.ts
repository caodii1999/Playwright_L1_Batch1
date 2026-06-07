import { test as data } from "@playwright/test";
import { logger } from "../helpers/logger";
import { User } from "../types/user.type";
import { EmailService } from "../services/email.service";
import { DEFAULT_USER_PASSWORD } from "../constants/user.constant";
import { Billing } from "../types/billing.type";
import { BILLING } from "../constants/billing.constant";
import { Review } from "../types/review.type";
import { REVIEW } from "../constants/review.constant";

export const test = data.extend<{
  _logger: void;
  user: User;
  mail: EmailService;
  billing: Billing;
  expectedBilling: Billing;
  review: Review;
}>({
  _logger: [
    async ({}, use, testInfo) => {
      await use();
      await logger.attachToReport(testInfo);
      logger.clear();
    },
    { auto: true },
  ],

  mail: async ({}, use) => {
    const mail = new EmailService();
    await mail.getEmailAddress();
    await use(mail);
  },

  user: async ({ mail }, use) => {
    await use({ username: mail.email, password: DEFAULT_USER_PASSWORD });
  },

  billing: async ({ mail }, use) => {
    await use({
      firstName: BILLING.FIRST_NAME,
      lastName: BILLING.LAST_NAME,
      address: BILLING.ADDRESS,
      city: BILLING.CITY,
      country: BILLING.COUNTRY,
      phoneNumber: BILLING.PHONE,
      email: mail.email,
    });
  },
  expectedBilling: async ({ mail }, use) => {
    await use({
      firstName: BILLING.FIRST_NAME,
      lastName: BILLING.LAST_NAME,
      fullName: BILLING.FULL_NAME,
      address: BILLING.ADDRESS,
      city: BILLING.CITY,
      country: BILLING.COUNTRY,
      phoneNumber: BILLING.PHONE,
      email: mail.email,
    });
  },

  review: async ({}, use) => {
    await use({
      rating: REVIEW.RATING,
      comment: REVIEW.COMMENT,
    });
  },
});

export { expect } from "@playwright/test";
