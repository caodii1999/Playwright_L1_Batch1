import { test, expect } from "../fixtures/index";
import { Pages } from "../enum/pages.enum";
import { Review } from "../types/review.type";

test("Verify users can post a review", async ({
  homePage,
  accountPage,
  productPage,
  productDetailPage,
  user,
  review,
  registerAccount,
}) => {
  let expectedReview: Review;
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

  await test.step("4. Click on a product to view detail", async () => {
    await productPage.selectRandomItem();
  });

  await test.step("5. Scroll down then click on REVIEWS tab", async () => {
    await productDetailPage.clickReviewsTab();
  });

  await test.step("6. Submit a review", async () => {
    expectedReview = await productDetailPage.submitReview(review);
  });

  await test.step("7. Verify new review", async () => {
    expect
      .soft(
        await productDetailPage.getLatestReviewComment(),
        "Review comment should match submitted comment",
      )
      .toEqual(expectedReview);

    expect.soft(await productDetailPage.isNumberOfReviewUpdated(), "review count should update according the list of reviews").toBeTruthy();
  });
});
