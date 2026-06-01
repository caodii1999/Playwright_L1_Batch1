import { test, expect } from "../fixtures/index";
import { Order } from "../types/order.type";

test("Ensure proper error handling when mandatory fields are blank", async ({
  homePage,
  productPage,
  shoppingCartPage,
  checkoutPage,
  orderStatusPage,
  accountPage,
  productDetailPage,
  goto,
  registerAccount,
  login,
  navigateToShopPage,
  fillBillingInfo,
  selectDefaultPaymentMethod,
  selectOrderHistory,
}) => {
  await test.step("User is at checkout", async () => {
    await goto();
    await navigateToShopPage();
    await productPage.selectRandomItem();
    await productDetailPage.clickOnAddToCart();
    await productDetailPage.goToCart();
    await shoppingCartPage.clickCheckout();
  });

  await test.step("1. Leave mandatory fields (address, payment info) blank", async () => {
   
  });

  await test.step("2. Click on Orders in left navigation", async () => {
    await selectOrderHistory();
  });

  await test.step("3. Verify order details", async () => {
   
  });
});
