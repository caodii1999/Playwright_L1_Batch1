import { test, expect } from "../fixtures/index";
import { ORDER_CONFIRMATION_MSG } from "../constants/order-status.constants";

test("Verify users try to buy an item without logging in (As a guest)", async ({
  productPage,
  productDetailPage,
  shoppingCartPage,
  checkoutPage,
  orderStatusPage,
  goto,
  navigateToShopPage,
  fillBillingInfo,
  selectDefaultPaymentMethod,
}) => {
  await test.step("1. Open https://demo.testarchitect.com/", async () => {
    await goto();
  });

  await test.step("2. Navigate to 'Shop' or 'Products' section", async () => {
    await navigateToShopPage();
  });

  await test.step("3. Add a product to cart", async () => {
    await productPage.selectRandomItem();
    await productDetailPage.clickOnAddToCart();
  });

  await test.step("4. Click on Cart button", async () => {
    await productDetailPage.goToCart();
  });

  await test.step("5. Proceed to complete order", async () => {
    await shoppingCartPage.clickCheckout();
    await fillBillingInfo();
    await selectDefaultPaymentMethod();
    await checkoutPage.clickPlaceOrder();
  });

  await test.step("Guests should be purchased the order successfully", async () => {
    expect
      .soft(await orderStatusPage.getConfirmationMsg())
      .toEqual(ORDER_CONFIRMATION_MSG);
  });
});
