import { BasePage } from "./base.page";
import { logger } from "../helpers/logger";
import { Product } from "../types/product.type";
import { Review } from "../types/review.type";

export class ProductDetailPage extends BasePage {
  readonly addToCartBtn = this.el(
    "//div[@class = 'fixed-content']//form//button[contains(text(), 'Add to cart')]",
    "xpath",
  );
  readonly productName = this.el(
    "//div[@class = 'product-information-inner']//div[@class = 'fixed-content']//h1[@class = 'product_title entry-title']",
    "xpath",
  );
  readonly productPrice = this.el(
    "//div[@class='row']//p[@class='price']/ins | //div[@class='row']//p[@class='price']/span/bdi",
    "xpath",
  );
  readonly productQuantity = this.el(
    "//div[@class = 'quantity']//input[@class = 'input-text qty text']",
    "xpath",
  );
  readonly reviewTab = this.el("(//a[@id='tab_reviews'])[1]", "xpath");
  readonly commentInput = this.el("Your review *", "label");
  readonly starsLocator = this.el("//p[@class = 'stars']//a", "xpath");
  readonly submitBtn = this.el("button:Submit", "role");
  readonly allReviews = this.el("//div[@id = 'comments']//ol//li", "xpath");
  readonly latestReview = this.el(
    "//div[@id = 'comments']//ol//li[contains(@class, 'review byuser')]",
    "xpath",
  );
  readonly latestReviewStars = this.el(
    "//div[@id = 'comments']//ol//li[contains(@class, 'review byuser')]//div//div//div//span//strong",
    "xpath",
  );
  readonly latestReviewComment = this.el(
    "//div[@id = 'comments']//ol//li[contains(@class, 'review byuser')]//div//div//div[@class = 'description']//p",
    "xpath",
  );
  readonly numberOfReviews = this.el(
    "//a[@class = 'woocommerce-review-link']//span",
    "xpath",
  );

  async clickOnAddToCart(): Promise<void> {
    await this.addToCartBtn.scrollIntoViewIfNeeded();
    await this.addToCartBtn.click();
    logger.info(`Click on Add to Cart button`);
  }

  async getProductName(): Promise<string> {
    await this.productName.scrollIntoViewIfNeeded();
    const name = (await this.productName.innerText()).toLowerCase();
    logger.info(`name: ${name}`);
    return name;
  }

  async getProductPrice(): Promise<number> {
    await this.productPrice.scrollIntoViewIfNeeded();
    const priceText = await this.productPrice.textContent();
    const price = parseFloat(
      priceText!
        .replace(" ", " ")
        .replace("$", "")
        .replace(",", "")
        .replace(/[^0-9.\-]/g, "")
        .trim(),
    );

    logger.info(`Unit price: ${price}`);
    return price;
  }

  async getProductQuantity(): Promise<number> {
    await this.productQuantity.scrollIntoViewIfNeeded();
    const qtyText = await this.productQuantity.inputValue();

    const qty = parseInt(qtyText.trim());
    logger.info(`Quantity: ${qty}`);
    return qty;
  }

  async getProductInfo(): Promise<Product> {
    const name = await this.getProductName();
    const price = await this.getProductPrice();
    const quantity = await this.getProductQuantity();
    logger.info(
      `product name: ${name}, price: ${price}, quantity: ${quantity}`,
    );
    return { name: name, price: price, quantity: quantity };
  }

  async clickReviewsTab(): Promise<void> {
    await this.reviewTab.waitFor({ state: "visible" });
    await this.reviewTab.scrollIntoViewIfNeeded();
    await this.reviewTab.click();
  }

  async selectReviewStar(rating: number): Promise<void> {
    await this.starsLocator.nth(rating - 1).click();
    logger.info(`Selected star rating: ${rating}`);
  }

  async fillReview(comment: string): Promise<void> {
    await this.commentInput.fill(comment);
  }

  async clickSubmit(): Promise<void> {
    await this.submitBtn.scrollIntoViewIfNeeded();
    await this.submitBtn.click();
    await this.page.waitForLoadState("load");
  }

  async submitReview(review: Review): Promise<Review> {
    await this.selectReviewStar(review.rating);
    await this.fillReview(review.comment);
    await this.clickSubmit();

    return { comment: review.comment, rating: review.rating };
  }

  async getLatestReviewComment(): Promise<Review> {
    await this.page.waitForLoadState("load");
    const comment = await this.latestReviewComment.innerText();
    const rateText = await this.latestReviewStars.innerText();
    const rating = parseFloat(rateText.trim());

    return { comment: comment, rating: rating };
  }

  async getNumberOfReviews(): Promise<number> {
    return parseFloat((await this.numberOfReviews.innerText()).trim());
  }

  async isNumberOfReviewUpdated(): Promise<boolean> {
    const expected = await this.allReviews.count();
    const actual = await this.getNumberOfReviews();

    logger.info(`expected reviews: ${expected}, actual reviews: ${actual}`);

    return expected === actual;
  }
}
