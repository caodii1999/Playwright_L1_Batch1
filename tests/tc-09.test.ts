import { test, expect } from "../fixtures/index";
import { Pages } from "../enum/pages.enum";

test("Verify users can update quantity of product in cart", async ({
  homePage,
  accountPage,
  productPage,
  productDetailPage,
  shoppingCartPage,
  user,

  registerAccount,
}) => {
  await test.step("1. Open browser and go to https://demo.testarchitect.com/", async () => {
    await homePage.goto();
  });

  await test.step("2. Login with valid credentials", async () => {
    await homePage.navigateToAccountPage();
    await registerAccount();
    await accountPage.login(user);
  });

  await test.step("3. Go to Shop page", async () => {
    await homePage.navigateToPage(Pages.SHOP);
  });

  await test.step("4. Add a product", async () => {
    await productPage.selectRandomItem();
    await productDetailPage.clickOnAddToCart();
  });

  await test.step("5. Go to the cart", async () => {
    await productDetailPage.goToCart();
  });

  await test.step("6. Verify quantity of added product", async () => {
    expect
      .soft(
        await shoppingCartPage.getProductQuantity(),
        "Initial quantity should be 1",
      )
      .toBe(1);
  });

  await test.step("7. Click on Plus(+) button", async () => {
    await shoppingCartPage.clickPlusQty();
  });

  await test.step("8. Verify quantity of product and SUB TOTAL price", async () => {
    expect
      .soft(
        await shoppingCartPage.getProductQuantity(),
        "Quantity should be 2 after clicking +",
      )
      .toBe(2);
    expect.soft(await shoppingCartPage.isSubTotalValid()).toBeTruthy();
  });

  await test.step("9. Enter 4 into quantity textbox then click on UPDATE CART button", async () => {
    await shoppingCartPage.setQuantity(4);
  });

  await test.step("10. Verify quantity of product is 4 and SUB TOTAL price", async () => {
    expect
      .soft(
        await shoppingCartPage.getProductQuantity(),
        "Quantity should be 4 after update",
      )
      .toBe(4);
    expect.soft(await shoppingCartPage.isSubTotalValid()).toBeTruthy();
  });

  await test.step("11. Click on Minus(-) button", async () => {
    await shoppingCartPage.clickMinusQty();
  });

  await test.step("12. Verify quantity of product and SUB TOTAL price", async () => {
    expect
      .soft(
        await shoppingCartPage.getProductQuantity(),
        "Quantity should be 3 after clicking -",
      )
      .toBe(3);
    expect.soft(await shoppingCartPage.isSubTotalValid()).toBeTruthy();
  });
});
