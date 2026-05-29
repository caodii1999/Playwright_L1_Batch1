import { test, expect } from "../fixtures/index";
import { ORDER_CONFIRMATION_MSG } from "../constants/order-status.constants";
import { Product } from "../types/product.type";

test("Verify users can buy multiple item successfully", async ({
  homePage,
  productPage,
  shoppingCartPage,
  checkoutPage,
  orderStatusPage,
  goto,
  registerAccount,
  login,
  navigateToShopPage,
  fillBillingInfo,
  selectDefaultPaymentMethod,
}) => {
  let expectSelectedProducts: Product[];

  await test.step("1. Open browser and go to https://demo.testarchitect.com/", async () => {
    await goto();
  });

  await test.step("2. Login with valid credentials ", async () => {
    await homePage.navigateToAccountPage();
    await registerAccount();
    await login();
  });

  await test.step("3. Go to Shop page", async () => {
    await navigateToShopPage();
  });

  await test.step("4. Select multiple items and add to cart", async () => {
    expectSelectedProducts =
      await productPage.getMultipleRandomItemsAndGetInfo(3);
  });

  await test.step("5. Go to the cart and verify all selected items", async () => {
    await productPage.goToCart();
    expect
      .soft(await shoppingCartPage.getAllProductsInCart())
      .toEqual(expectSelectedProducts);
  });

  await test.step("6. Proceed to checkout and confirm order", async () => {
    await shoppingCartPage.clickCheckout();
    await fillBillingInfo();
    await selectDefaultPaymentMethod();
    await checkoutPage.clickPlaceOrder();
  });

  await test.step("7. Verify order confirmation message", async () => {
    expect
      .soft(await orderStatusPage.getConfirmationMsg())
      .toEqual(ORDER_CONFIRMATION_MSG);
  });

  await test.step("All selected items are purchased, and order confirmation is received", async () => {
    expect
      .soft(await orderStatusPage.getAllOrderedProducts())
      .toEqual(expectSelectedProducts);
  });
});