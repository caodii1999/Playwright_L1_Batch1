import { test, expect } from "../fixtures/index";

test.describe("Locator verification", () => {

  test("BasePage — header locators", async ({ page, homePage }) => {
    await page.goto("/");

    expect.soft(await homePage.loginSignUpBtn.isVisible(),    "loginSignUpBtn").toBeTruthy();
    expect.soft(await homePage.cartBtn.isVisible(),           "cartBtn").toBeTruthy();
    expect.soft(await homePage.allDepartmentMenu.isVisible(), "allDepartmentMenu").toBeTruthy();
  });

  test("AccountPage — login & register form locators", async ({ page, accountPage }) => {
    await page.goto("/my-account/");

    expect.soft(await accountPage.usernameTextbox.isVisible(),   "usernameTextbox").toBeTruthy();
    expect.soft(await accountPage.passwordTextbox.isVisible(),   "passwordTextbox").toBeTruthy();
    expect.soft(await accountPage.loginBtn.isVisible(),          "loginBtn").toBeTruthy();
    expect.soft(await accountPage.regisEmailTextbox.isVisible(), "regisEmailTextbox").toBeTruthy();
    expect.soft(await accountPage.registerBtn.isVisible(),       "registerBtn").toBeTruthy();
  });

  test("ProductPage — shop list locators", async ({ page, productPage }) => {
    await page.goto("/shop/");

    expect.soft(await productPage.gridViewBtn.isVisible(),           "gridViewBtn").toBeTruthy();
    expect.soft(await productPage.listViewBtn.isVisible(),           "listViewBtn").toBeTruthy();
    expect.soft(await productPage.sortBtn.isVisible(),               "sortBtn").toBeTruthy();
    expect.soft(await productPage.multipleProductTitles.isVisible(), "multipleProductTitles").toBeTruthy();
    expect.soft(await productPage.multipleProductPrices.isVisible(), "multipleProductPrices").toBeTruthy();
  });

  test("ProductDetailPage — product detail locators", async ({ page, productPage, productDetailPage }) => {
    await page.goto("/shop/");
    await productPage.selectRandomItem();

    expect.soft(await productDetailPage.addToCartBtn.isVisible(),    "addToCartBtn").toBeTruthy();
    expect.soft(await productDetailPage.productName.isVisible(),     "productName").toBeTruthy();
    expect.soft(await productDetailPage.productPrice.isVisible(),    "productPrice").toBeTruthy();
    expect.soft(await productDetailPage.productQuantity.isVisible(), "productQuantity").toBeTruthy();
  });

  test("ShoppingCartPage — cart locators", async ({ page, productPage, productDetailPage, shoppingCartPage, homePage }) => {
    await page.goto("/shop/");
    await productPage.selectRandomItem();
    await productDetailPage.clickOnAddToCart();
    await homePage.goToCart();

    expect.soft(await shoppingCartPage.productsNames.isVisible(),    "productsNames").toBeTruthy();
    expect.soft(await shoppingCartPage.productPrices.isVisible(),    "productPrices").toBeTruthy();
    expect.soft(await shoppingCartPage.productQuantities.isVisible(), "productQuantities").toBeTruthy();
    expect.soft(await shoppingCartPage.checkoutBtn.isVisible(),      "checkoutBtn").toBeTruthy();
  });

  test("CheckoutPage — checkout form locators", async ({ page, productPage, productDetailPage, shoppingCartPage, checkoutPage, homePage }) => {
    await page.goto("/shop/");
    await productPage.selectRandomItem();
    await productDetailPage.clickOnAddToCart();
    await homePage.goToCart();
    await shoppingCartPage.clickCheckout();

    expect.soft(await checkoutPage.productNameAndQuantity.isVisible(), "productNameAndQuantity").toBeTruthy();
    expect.soft(await checkoutPage.productPrice.isVisible(),           "productPrice").toBeTruthy();
    expect.soft(await checkoutPage.productQuantity.isVisible(),        "productQuantity").toBeTruthy();
    expect.soft(await checkoutPage.countryDropdown.isVisible(),        "countryDropdown").toBeTruthy();
    expect.soft(await checkoutPage.placeOrderBtn.isVisible(),          "placeOrderBtn").toBeTruthy();
  });

  test("OrderStatusPage — order confirmation locators", async ({ page, productPage, productDetailPage, shoppingCartPage, checkoutPage, orderStatusPage, homePage, billing }) => {
    await page.goto("/shop/");
    await productPage.selectRandomItem();
    await productDetailPage.clickOnAddToCart();
    await homePage.goToCart();
    await shoppingCartPage.clickCheckout();
    await checkoutPage.fillBillingInfo(billing);
    await checkoutPage.clickPlaceOrder();

    expect.soft(await orderStatusPage.orderConfirmationMsg.isVisible(),      "orderConfirmationMsg").toBeTruthy();
    expect.soft(await orderStatusPage.orderNumberLocator.isVisible(),        "orderNumberLocator").toBeTruthy();
    expect.soft(await orderStatusPage.orderDateLocator.isVisible(),          "orderDateLocator").toBeTruthy();
    expect.soft(await orderStatusPage.orderTotalLocator.isVisible(),         "orderTotalLocator").toBeTruthy();
    expect.soft(await orderStatusPage.orderPaymentMethodLocator.isVisible(), "orderPaymentMethodLocator").toBeTruthy();
    expect.soft(await orderStatusPage.orderEmailLocator.isVisible(),         "orderEmailLocator").toBeTruthy();
    expect.soft(await orderStatusPage.productName.isVisible(),               "productName").toBeTruthy();
    expect.soft(await orderStatusPage.productPrice.isVisible(),              "productPrice").toBeTruthy();
    expect.soft(await orderStatusPage.productQuantity.isVisible(),           "productQuantity").toBeTruthy();
    expect.soft(await orderStatusPage.billingAddress.isVisible(),            "billingAddress").toBeTruthy();
    expect.soft(await orderStatusPage.actualPhone.isVisible(),               "actualPhone").toBeTruthy();
    expect.soft(await orderStatusPage.actualEmail.isVisible(),               "actualEmail").toBeTruthy();
  });

});
