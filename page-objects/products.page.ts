import { Locator, Page } from "@playwright/test";
import { BasePage } from "./base.page";
import { logger } from "../helpers/logger";
import { Product } from "../types/product.type";

export class ProductPage extends BasePage {
  readonly gridViewBtn: Locator;
  readonly listViewBtn: Locator;
  readonly multipleProductTitles: Locator;
  readonly multipleProductPrices: Locator;
  readonly addToCartBtn: Locator;

  constructor(page: Page) {
    super(page);
    this.gridViewBtn = page.locator("//div[contains(@class, 'switch-grid')]");
    this.listViewBtn = page.locator("//div[contains(@class, 'switch-list')]");
    this.multipleProductTitles = page.locator(
      "//div[@class = 'text-center product-details']//h2[@class = 'product-title']",
    );
    this.multipleProductPrices = page.locator(
      "//div[@class='text-center product-details']//span[@class='woocommerce-Price-amount amount']/bdi[not(ancestor::del)]",
    );
    this.addToCartBtn = page.locator(
      "//div[@class = 'text-center product-details']//h2[@class = 'product-title']//following-sibling::a[text() = 'Add to cart']",
    );
  }
  async clickGridView(): Promise<void> {
    await this.gridViewBtn.click();
    await this.page.waitForURL("**/?view_mode=grid**");
    logger.info("Click on Grid View button");
  }

  async clickListView(): Promise<void> {
    await this.listViewBtn.click();
    await this.page.waitForURL("**/?view_mode=list**");
    logger.info("Click on List View button");
  }

  async isGridView(): Promise<boolean> {
    return this.isUrlContained("view_mode=grid");
  }

  async isListView(): Promise<boolean> {
    return this.isUrlContained("view_mode=list");
  }

  async selectRandomItem(): Promise<void> {
    await this.multipleProductTitles.first().waitFor({ state: "visible" });

    const count = await this.multipleProductTitles.count();

    const randomIndex = Math.floor(Math.random() * count);
    await this.multipleProductTitles.nth(randomIndex).scrollIntoViewIfNeeded();
    await this.multipleProductTitles.nth(randomIndex).click();
    logger.info(`Selected random item at index: ${randomIndex}`);
  }

  async getMultipleRandomItemsAndGetInfo(
    numberOfItemsToGet: number,
  ): Promise<Product[]> {
    await this.multipleProductTitles.first().waitFor({ state: "visible" });

    const totalItems = Math.min(
      numberOfItemsToGet,
      await this.multipleProductTitles.count(),
    );

    const randomIndexes = new Set<number>();

    while (randomIndexes.size < totalItems) {
      randomIndexes.add(
        Math.floor(Math.random() * (await this.multipleProductTitles.count())),
      );
    }

    const products: Product[] = [];

    for (const index of randomIndexes) {
      const title = this.multipleProductTitles.nth(index);
      const priceElement = this.multipleProductPrices.nth(index);
      const addBtn = this.addToCartBtn.nth(index);

      const name = (await title.textContent())?.toLowerCase().trim() ?? "";
      const priceText = (await priceElement.textContent()) ?? "";
      const price = parseFloat(priceText.replace("$", "").trim());

      await addBtn.scrollIntoViewIfNeeded();
      await addBtn.click();

      await this.waitUntilProductAdded(index);

      logger.info(`Selected product: ${name} | Price: ${price}`);

      products.push({ name, price, quantity: 1 });
    }
    return products;
  }

  async waitUntilProductAdded(index: number): Promise<void> {
    const element = await this.addToCartBtn.nth(index).elementHandle();

    if (!element) {
      throw new Error("Add To Cart button not found");
    }

    await this.page.waitForFunction(
      (el) => el.className.includes("added"),
      element,
    );
  }
}
