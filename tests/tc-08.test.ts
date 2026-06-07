import { test, expect } from "../fixtures/index";

test("Verify users can clear the cart", async ({
  homePage,
  accountPage,
  productPage,
  productDetailPage,
  shoppingCartPage,
  user,
  userAddedAnItemsIntoCart
}) => {
  await test.step("User added an item into cart", async () => {
    await userAddedAnItemsIntoCart(user);
  });

  await test.step("1. Open browser and go to https://demo.testarchitect.com/", async () => {
    await homePage.goto();
  });

  await test.step("2. Login with valid credentials", async () => {
    await accountPage.navigateToAccountPage();
    await accountPage.login(user);
  });

  await test.step("3. Go to Shopping cart page", async () => {
    await productDetailPage.goToCart();
  });

  await test.step("4. Verify items show in table", async () => {
    const products = await shoppingCartPage.getAllProductsInCart();
    expect
      .soft(products.length, "Cart should contain at least one item")
      .toBeGreaterThan(0);
  });

  await test.step("5. Click on Clear shopping cart", async () => {
    await shoppingCartPage.clearCart();
  });

  await test.step("6. Verify empty cart page displays", async () => {
    expect
      .soft(
        await shoppingCartPage.isCartEmpty(),
        "Cart should be empty after clearing",
      )
      .toBeTruthy();
  }); 
});
