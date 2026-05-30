import { test, expect } from "../fixtures/index";
import { Order } from "../types/order.type";

test("Verify orders appear in order history", async ({
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
  let firstOrder: Order;
  let secondOrder: Order;

  let expectedOrders: Order[];
  await test.step("User has placed 02 orders", async () => {
    await goto();
    await homePage.navigateToAccountPage();
    await registerAccount();
    await login();
    await navigateToShopPage();
    await productPage.selectRandomItem();
    await productDetailPage.clickOnAddToCart();
    await productDetailPage.goToCart();
    await shoppingCartPage.clickCheckout();
    await fillBillingInfo();
    await selectDefaultPaymentMethod();
    await checkoutPage.clickPlaceOrder();

    firstOrder = await orderStatusPage.getOrderInfo();

    await navigateToShopPage();
    await productPage.selectRandomItem();
    await productDetailPage.clickOnAddToCart();
    await productDetailPage.goToCart();
    await shoppingCartPage.clickCheckout();
    await fillBillingInfo();
    await selectDefaultPaymentMethod();
    await checkoutPage.clickPlaceOrder();

    secondOrder = await orderStatusPage.getOrderInfo();

    expectedOrders = [secondOrder, firstOrder];
  });

  await test.step("1. Go to My Account page", async () => {
    await orderStatusPage.navigateToAccountPage();
  });

  await test.step("2. Click on Orders in left navigation", async () => {
    await selectOrderHistory();
  });

  await test.step("3. Verify order details", async () => {
    expect(await accountPage.getAllOrderInfo()).toEqual(expectedOrders);
  });
});
