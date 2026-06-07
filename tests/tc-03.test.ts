import { test, expect } from "../fixtures/index";
import { ORDER_CONFIRMATION_MSG } from "../constants/messages.constant";
import { Pages } from "../enum/pages.enum";
import { userInfo } from "node:os";

test.describe("Buy item flow", () => {
  test("Direct bank transfer", async ({
    homePage,
    accountPage,
    productPage,
    productDetailPage,
    shoppingCartPage,
    checkoutPage,
    orderStatusPage,

    user,

    registerAccount,  
    fillBillingInfo,
    selectDefaultPaymentMethod,
  }) => {
    await test.step("1. Open browser and go to https://demo.testarchitect.com/", async () => {
      await homePage.goto();
    });
    await test.step("2. Login with valid credentials ", async () => {
      await homePage.navigateToAccountPage();
      await registerAccount();
      await accountPage.login(user);
    });
    await test.step("3. Go to Shop page", async () => {
      await homePage.navigateToPage(Pages.SHOP);
    });
    await test.step("4. Select an item and add to cart", async () => {
      await productPage.selectRandomItem();
      await productDetailPage.clickOnAddToCart();
      await productDetailPage.goToCart();
    });
    await test.step("5. Go to Checkout page", async () => {
      await shoppingCartPage.clickCheckout();
    });
    await test.step("6. Choose a different payment method (Direct bank transfer)", async () => {
      await selectDefaultPaymentMethod();
    });
    await test.step("7. Complete the payment process", async () => {
      await fillBillingInfo();
      await checkoutPage.clickPlaceOrder();
    });
    await test.step("8. Verify order confirmation message", async () => {
      expect
        .soft(await orderStatusPage.getConfirmationMsg())
        .toEqual(ORDER_CONFIRMATION_MSG);
    });
  });

  test("Check payments", async ({
    homePage,
    accountPage,
    productPage,
    productDetailPage,
    shoppingCartPage,
    checkoutPage,
    orderStatusPage,
    
    user,
    registerAccount,
    fillBillingInfo,
    selectCheckPaymentMethod,
  }) => {
    await test.step("1. Open browser and go to https://demo.testarchitect.com/", async () => {
      await homePage.goto();
    });
    await test.step("2. Login with valid credentials ", async () => {
      await homePage.navigateToAccountPage();
      await registerAccount();
      await accountPage.login(user);
    });
    await test.step("3. Go to Shop page", async () => {
      await homePage.navigateToPage(Pages.SHOP);
    });
    await test.step("4. Select an item and add to cart", async () => {
      await productPage.selectRandomItem();
      await productDetailPage.clickOnAddToCart();
      await productDetailPage.clickOnAddToCart();
    });
    await test.step("5. Go to Checkout page", async () => {
      await shoppingCartPage.clickCheckout();
    });
    await test.step("6. Choose a different payment method (Check Payment)", async () => {
      await selectCheckPaymentMethod();
    });
    await test.step("7. Complete the payment process", async () => {
      await fillBillingInfo();
      await checkoutPage.clickPlaceOrder();
    });
    await test.step("8. Verify order confirmation message", async () => {
      expect
        .soft(await orderStatusPage.getConfirmationMsg())
        .toEqual(ORDER_CONFIRMATION_MSG);
    });
  });

  test("Cash on delivery", async ({
    homePage,
    accountPage,
    productPage,
    productDetailPage,
    shoppingCartPage,
    checkoutPage,
    orderStatusPage,
    user,
    registerAccount,
    fillBillingInfo,
    selectCODMethod,
  }) => {
    await test.step("1. Open browser and go to https://demo.testarchitect.com/", async () => {
      await homePage.goto();
    });
    await test.step("2. Login with valid credentials ", async () => {
      await homePage.navigateToAccountPage();
      await registerAccount();
      await accountPage.login(user);
    });
    await test.step("3. Go to Shop page", async () => {
      await homePage.navigateToPage(Pages.SHOP);
    });
    await test.step("4. Select an item and add to cart", async () => {
      await productPage.selectRandomItem();
      await productDetailPage.clickOnAddToCart();
      await productDetailPage.clickOnAddToCart();
    });
    await test.step("5. Go to Checkout page", async () => {
      await shoppingCartPage.clickCheckout();
    });
    await test.step("6. Choose a different payment method (Cash on delivery)", async () => {
      await selectCODMethod();
    });
    await test.step("7. Complete the payment process", async () => {
      await fillBillingInfo();
      await checkoutPage.clickPlaceOrder();
    });
    await test.step("8. Verify order confirmation message", async () => {
      expect
        .soft(await orderStatusPage.getConfirmationMsg())
        .toEqual(ORDER_CONFIRMATION_MSG);
    });
  });
});