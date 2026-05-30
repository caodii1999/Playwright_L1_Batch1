import { Locator, Page } from "@playwright/test";
import { BasePage } from "./base.page";
import { logger } from "../helpers/logger";
import { Product } from "../types/product.type";

export class ProductDetailPage extends BasePage {
  readonly addToCartBtn: Locator;
  readonly productName: Locator;
  readonly productPrice: Locator;
  readonly productQuantity: Locator;

  constructor(page: Page) {
    super(page);
    this.addToCartBtn = page
      .locator(
        "//div[@class = 'product-information-inner']//form[@class='cart']//button[text() = 'Add to cart']",
      )
      .first();
    this.productName = page
      .locator(
        "//div[@class = 'product-information-inner']//div[@class = 'fixed-content']//h1[@class = 'product_title entry-title']",
      )
      .first();
    this.productPrice = page
      .locator(
        "//div[@class='row']//p[@class='price']/ins | //div[@class='row']//p[@class='price']/span/bdi",
      )
      .first();
    this.productQuantity = page.locator(
      "//div[@class = 'quantity']//input[@class = 'input-text qty text']",
    );
  }

  async clickOnAddToCart(): Promise<void> {
    await this.addToCartBtn.scrollIntoViewIfNeeded();
    await this.addToCartBtn.click({ force: true });
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
        .replace("\u00A0", " ")
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
}
