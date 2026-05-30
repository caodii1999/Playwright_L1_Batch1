import { test, expect } from "../fixtures/index";

test.describe("Verify users can sort items by price", () => {
  test("Verify low to high", async ({
    homePage,
    productPage,
    goto,
    registerAccount,
    login,
    navigateToShopPage,
    selectSortLowToHigh,
  }) => {
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

    await test.step("4. Switch view to list", async () => {
      await productPage.clickListView();
    });

    await test.step("5. Sort items by price (low to high)", async () => {
      await selectSortLowToHigh();
    });

    await test.step("6. Verify the order of items", async () => {
      expect(await productPage.isPriceSortedLowToHigh()).toBeTruthy();
    });
  });

  test("Verify high to low", async ({
    homePage,
    productPage,
    goto,
    registerAccount,
    login,
    navigateToShopPage,
    selectSortHighToLow,
  }) => {
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

    await test.step("4. Switch view to list", async () => {
      await productPage.clickListView();
    });

    await test.step("5. Sort items by price (low to high)", async () => {
      await selectSortHighToLow();
    });

    await test.step("6. Verify the order of items", async () => {
      expect(await productPage.isPriceSortedHighToLow()).toBeTruthy();
    });
  });
});
