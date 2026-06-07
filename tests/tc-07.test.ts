import { test, expect } from "../fixtures/index";
import { Pages } from "../enum/pages.enum";

test("Ensure proper error handling when mandatory fields are blank", async ({
  homePage,
  productPage,
  shoppingCartPage,
  checkoutPage,
  productDetailPage,
}) => {
  await test.step("User is at checkout", async () => {
    await homePage.goto();
    await homePage.navigateToPage(Pages.SHOP);
    await productPage.selectRandomItem();
    await productDetailPage.clickOnAddToCart();
    await productDetailPage.goToCart();
    await shoppingCartPage.clickCheckout();
  });

  await test.step("1. Leave mandatory fields (address, payment info) blank", async () => {});

  await test.step(" 2. Click 'Confirm Order'", async () => {
    await checkoutPage.clickPlaceOrder();
  });

  await test.step(" 3. Verify error messages", async () => {
    expect(await checkoutPage.isErrorMsgMatchMissingField()).toBeTruthy();
  });
});
