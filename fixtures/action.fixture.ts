import { test as base } from "./page.fixture";

import { Product } from "../types/product.type";
import { Pages } from "../enum/pages.enum";
import { PaymentMethod } from "../enum/payments.enum";
import { Sort } from "../enum/sort.enum";
import { AccountNavItems } from "../enum/account-nav-items.enum";
import { User } from "../types/user.type";

export const test = base.extend<{
  registerAccount: () => Promise<void>;
  isCheckoutPageDisplayed: () => Promise<boolean>;
  fillBillingInfo: () => Promise<void>;
  selectDefaultPaymentMethod: () => Promise<void>;
  selectCheckPaymentMethod: () => Promise<void>;
  selectCODMethod: () => Promise<void>;
  isOrderStatusPageDisplayed: () => Promise<boolean>;
  navigateToShopPage: () => Promise<void>;
  selectRandomMultipleItemsAndGetInfo: (count: number) => Promise<Product[]>;
  selectSortLowToHigh: () => Promise<void>;
  selectSortHighToLow: () => Promise<void>;
  selectOrderHistory: () => Promise<void>;
  navigateToAccountPage: () => Promise<void>;
  userAddedAnItemsIntoCart: (user: User) => Promise<void>;
}>({
  userAddedAnItemsIntoCart: async (
    {
      homePage,
      accountPage,
      productPage,
      productDetailPage,
      shoppingCartPage,
      checkoutPage,
      registerAccount,
      fillBillingInfo,
      selectDefaultPaymentMethod
    },
    use,
  ) => {
    await use(async (user) => {
      await homePage.goto();
      await accountPage.navigateToAccountPage();
      await registerAccount();
      await accountPage.login(user);
      await homePage.navigateToPage(Pages.SHOP);
      await productPage.selectRandomItem();
      await productDetailPage.clickOnAddToCart();
      await accountPage.navigateToAccountPage();
      await accountPage.logout();
    });
  },
  registerAccount: async ({ homePage, accountPage, page, user, mail }, use) => {
    await use(async () => {
      await accountPage.register(user.username);
      const resetUrl = await mail.getResetPasswordUrl();
      await page.goto(resetUrl);
      await accountPage.enterNewPassword(user.password);
    });
  },

  isCheckoutPageDisplayed: async ({ checkoutPage }, use) => {
    await use(async () => {
      return await checkoutPage.isUrlContained(Pages.CHECKOUT);
    });
  },

  fillBillingInfo: async ({ checkoutPage, billing }, use) => {
    await use(async () => {
      await checkoutPage.fillBillingInfo(billing);
    });
  },

  selectDefaultPaymentMethod: async ({ checkoutPage }, use) => {
    await use(async () => {
      await checkoutPage.selectPaymentMethod(
        PaymentMethod.DIRECT_BANK_TRANSFER,
      );
    });
  },

  selectCheckPaymentMethod: async ({ checkoutPage }, use) => {
    await use(async () => {
      await checkoutPage.selectPaymentMethod(PaymentMethod.CHECK_PAYMENTS);
    });
  },

  selectCODMethod: async ({ checkoutPage }, use) => {
    await use(async () => {
      await checkoutPage.selectPaymentMethod(PaymentMethod.COD);
    });
  },

  isOrderStatusPageDisplayed: async ({ orderStatusPage }, use) => {
    await use(async () => {
      return await orderStatusPage.isUrlContained(Pages.ORDER_STATUS);
    });
  },

  selectSortLowToHigh: async ({ productPage }, use) => {
    await use(async () => {
      await productPage.selectSortOption(Sort.LOW_TO_HIGH);
    });
  },

  selectSortHighToLow: async ({ productPage }, use) => {
    await use(async () => {
      await productPage.selectSortOption(Sort.HIGH_TO_LOW);
    });
  },
});

export { expect } from "@playwright/test";
