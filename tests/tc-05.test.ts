import { test, expect } from "../fixtures/index";
import { Order } from "../types/order.type";
import { Pages } from "../enum/pages.enum";
import { AccountNavItems } from "../enum/account-nav-items.enum";

test("Verify orders appear in order history", async ({
  homePage,
  accountPage,
  productPage,
  shoppingCartPage,
  checkoutPage,
  orderStatusPage,
  productDetailPage,
  user,
  registerAccount,
  fillBillingInfo,
  selectDefaultPaymentMethod,
}) => {
  let firstOrder: Order;
  let secondOrder: Order;
  let expectedOrders: Order[];

  await test.step("User has placed 02 orders", async () => {
    await homePage.goto();
    await homePage.navigateToAccountPage();
    await registerAccount();
    await accountPage.login(user);

    await homePage.navigateToPage(Pages.SHOP);
    await productPage.selectRandomItem();
    await productDetailPage.clickOnAddToCart();
    await productDetailPage.goToCart();
    await shoppingCartPage.clickCheckout();
    await fillBillingInfo();
    await selectDefaultPaymentMethod();
    await checkoutPage.clickPlaceOrder();

    firstOrder = await orderStatusPage.getOrderInfo();

    await homePage.navigateToPage(Pages.SHOP);
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
    await accountPage.clickAccountNavItems(AccountNavItems.ORDERS);
  });

  await test.step("3. Verify order details", async () => {
    expect(await accountPage.getAllOrderInfo()).toEqual(expectedOrders);
  });
});
