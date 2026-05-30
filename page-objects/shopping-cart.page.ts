import { Locator, Page } from "@playwright/test";
import { BasePage } from "./base.page";
import { logger } from "../helpers/logger";
import { Product } from "../types/product.type";

export class ShoppingCartPage extends BasePage {
  readonly productName: Locator;
  readonly productPrice: Locator;
  readonly productQuantity: Locator;
  readonly productsNames: Locator;
  readonly productPrices: Locator;
  readonly productQuantities: Locator;
  readonly checkoutBtn: Locator;

  constructor(page: Page) {
    super(page);
    this.productName = page.locator("//a[@class = 'product-title']");
    this.productPrice = page.locator(
      "//td[@class = 'product-price']//span//bdi",
    );
    this.productQuantity = page.locator(
      "//td[@class = 'product-quantity']//div//input[@class = 'input-text qty text']",
    );
    this.productsNames = page.locator(
      "//table[@class = 'shop_table shop_table_responsive cart woocommerce-cart-form__contents']//tbody//tr//td//div//a[@class = 'product-title']",
    );
    this.productPrices = page.locator(
      "//td[@class = 'product-price']//span//bdi",
    );
    this.productQuantities = page.locator(
      "//td[@class = 'product-quantity']//div//input[@class = 'input-text qty text']",
    );
    this.checkoutBtn = page.locator(
      "//div[@class = 'cart_totals ']//a[@href = 'https://demo.testarchitect.com/checkout/']",
    );
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

    logger.info(`price: ${price}`);
    return price;
  }

  async getProductQuantity(): Promise<number> {
    await this.productQuantity.scrollIntoViewIfNeeded();
    const qtyText = await this.productQuantity.inputValue();

    const qty = parseInt(qtyText.trim());
    logger.info(`Quantity: ${qty}`);
    return qty;
  }

  async getMiniProductInfo(): Promise<Product> {
    const name = await this.getProductName();
    const price = await this.getProductPrice();
    const quantity = await this.getProductQuantity();
    logger.info(
      `mini product name: ${name}, price: ${price}, quantity: ${quantity}`,
    );
    return { name: name, price: price, quantity: quantity };
  }

  async clickCheckout(): Promise<void> {
    await this.checkoutBtn.scrollIntoViewIfNeeded();
    await this.checkoutBtn.click();
  }

  async getAllProductsInCart(): Promise<Product[]> {
    const count = await this.productsNames.count();
    const products: Product[] = [];

    for (let i = 0; i < count; i++) {
      const name = (await this.productsNames.nth(i).innerText())
        .toLowerCase()
        .trim();

      const priceText = await this.productPrices.nth(i).innerText();
      const price = parseFloat(priceText.replace("$", "").trim());

      const qtyText = await this.productQuantities.nth(i).inputValue();
      const quantity = parseInt(qtyText.trim());

      logger.info(
        `Item ${i} -> name='${name}', price=${price}, qty=${quantity}`,
      );
      products.push({ name, price, quantity });
    }
    logger.info(`Total items read: ${count}`);
    return products;
  }
}
