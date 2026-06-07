import { test, expect } from "../fixtures/index";
import { Pages } from "../enum/pages.enum";

test.describe("Verify users can sort items by price", () => {
  test("Verify low to high", async ({
    homePage,
    accountPage,
    productPage,
    user,
    registerAccount,
    selectSortLowToHigh,
  }) => {
    await test.step("1. Open browser and go to https://demo.testarchitect.com/", async () => {
      await homePage.goto();
    });

    await test.step("2. Login with valid credentials ", async () => {
      await homePage.navigateToAccountPage();
      await registerAccount();
      await accountPage.login(user);
    });

    await test.step("3. Go to Shop page", async () => {
      await homePage.navigateToPage(Pages.SHOP);
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
    accountPage,
    productPage,
    user,
    registerAccount,
    selectSortHighToLow,
  }) => {
    await test.step("1. Open browser and go to https://demo.testarchitect.com/", async () => {
      await homePage.goto();
    });

    await test.step("2. Login with valid credentials ", async () => {
      await homePage.navigateToAccountPage();
      await registerAccount();
      await accountPage.login(user);
    });

    await test.step("3. Go to Shop page", async () => {
      await homePage.navigateToPage(Pages.SHOP);
    });

    await test.step("4. Switch view to list", async () => {
      await productPage.clickListView();
    });

    await test.step("5. Sort items by price (high to low)", async () => {
      await selectSortHighToLow();
    });

    await test.step("6. Verify the order of items", async () => {
      expect(await productPage.isPriceSortedHighToLow()).toBeTruthy();
    });
  });
});
