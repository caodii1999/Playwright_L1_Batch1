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

    constructor(page: Page){
        super(page);
        this.gridViewBtn = page.locator("//div[contains(@class, 'switch-grid')]");
        this.listViewBtn = page.locator("//div[contains(@class, 'switch-list')]");
        this.multipleProductTitles = page.locator("h2.product-title");
        this.multipleProductPrices = page.locator("//div[@class='text-center product-details']//span[@class='woocommerce-Price-amount amount']/bdi[not(ancestor::del)]");
        this.addToCartBtn = page.locator("//div[@class = 'text-center product-details']//h2[@class = 'product-title']//following-sibling::a[text() = 'Add to cart']");
    }
    async clickGridView(): Promise<void> {
        await this.gridViewBtn.click();
        await this.page.waitForURL('**/?view_mode=grid**');
        logger.info('Click on Grid View button');
    }

    async clickListView(): Promise<void> {
        await this.listViewBtn.click();
        await this.page.waitForURL('**/?view_mode=list**');
        logger.info('Click on List View button');
    }

    async isGridView(): Promise<boolean> {
        return this.isPageDisplayed('view_mode=grid');
    }

    async isListView(): Promise<boolean> {
        return this.isPageDisplayed('view_mode=list');
    }

    async selectRandomItem(): Promise<void> {
        await this.multipleProductTitles.first().waitFor({ state: 'visible' });
    
        const count = await this.multipleProductTitles.count();

        const randomIndex = Math.floor(Math.random() * count);
        await this.multipleProductTitles.nth(randomIndex).scrollIntoViewIfNeeded();
        await this.multipleProductTitles.nth(randomIndex).click();
        logger.info(`Selected random item at index: ${randomIndex}`);
    }

async selectRandomMultipleItemsAndGetInfo(count: number): Promise<Product[]> {
    const totalItems = await this.multipleProductTitles.count();
    const products: Product[] = [];

    const randomIndexes = new Set<number>();
    while (randomIndexes.size < count) {
        randomIndexes.add(Math.floor(Math.random() * totalItems));
    }
    for (const index of randomIndexes) {
        const name = (await this.multipleProductTitles.nth(index).innerText()).toLowerCase().trim();
        const priceText = await this.multipleProductPrices.nth(index).innerText();
        const price = parseFloat(
            priceText
                .replace('$', '')
                .replace(',', '')
                .trim()
        );
        await this.addToCartBtn.nth(index).click();
        logger.info(`Added to cart: ${name}, price: ${price}`);

        products.push({ name, price, quantity: 1 });
    }
        return products;
    }
}