import { Locator, Page } from "@playwright/test";
import { BasePage } from "./base.page";
import { logger } from "../helpers/logger";
import { Product } from "../types/product.type";
import { Sort } from "../enum/sort.enum";

export class ProductPage extends BasePage {
  readonly gridViewBtn: Locator;
  readonly listViewBtn: Locator;
  readonly multipleProductTitles: Locator;
  readonly multipleProductPrices: Locator;
  readonly addToCartBtn: Locator;
  readonly sortBtn: Locator;
  readonly allProducts: Locator;

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
    this.sortBtn = page.locator("//select[@class = 'orderby']");
    this.allProducts = page.locator("//div[@class = 'et-loader product-ajax']");
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

  async waitUntilProductLoaded(): Promise<void> {
    const element = await this.allProducts.elementHandle();

    if (!element) {
      throw new Error("Add To Cart button not found");
    }

    await this.page.waitForFunction(
      (el) => !el.className.includes("loading"),
      element,
    );
  }

  async selectSortOption(sort: Sort): Promise<void> {
    await this.waitUntilProductLoaded();
    await this.sortBtn.scrollIntoViewIfNeeded();
    await this.sortBtn.selectOption(sort);
    logger.info(`already selected sort`);
  }

  private async getPrice(index: number): Promise<number> {
    const priceText = await this.multipleProductPrices.nth(index).innerText();
    return parseFloat(
      priceText
        .replace("\u00A0", " ")
        .replace("$", "")
        .replace(",", "")
        .replace(/[^0-9.\-]/g, "")
        .trim(),
    );
  }

  private async getCurrentPrice(index: number): Promise<number> {
    return this.getPrice(index);
  }

  private async getNextPrice(index: number): Promise<number> {
    return this.getPrice(index + 1);
  }

  async isPriceSortedLowToHigh(): Promise<boolean> {
    await this.waitUntilProductLoaded();
    const count = await this.multipleProductPrices.count();

    for (let i = 0; i < count - 1; i++) {
      const currentPrice = await this.getCurrentPrice(i);
      const nextPrice = await this.getNextPrice(i);

      if (currentPrice > nextPrice) {
        return false;
      }
      logger.info(`compare ${currentPrice} to ${nextPrice}`);
    }
    return true;
  }

  async isPriceSortedHighToLow(): Promise<boolean> {
    await this.waitUntilProductLoaded();
    const count = await this.multipleProductPrices.count();

    for (let i = 0; i < count - 1; i++) {
      const currentPrice = await this.getCurrentPrice(i);
      const nextPrice = await this.getNextPrice(i);

      if (currentPrice < nextPrice) {
        return false;
      }
      logger.info(`compare ${currentPrice} to ${nextPrice}`);
    }
    return true;
  }
}
