import { Locator, Page } from "@playwright/test";
import { BasePage } from "./base.page";
import { logger } from "../helpers/logger";
import { Product } from "../types/product.type";

export class ShoppingCartPage extends BasePage{

    readonly productName: Locator;
    readonly productPrice: Locator;
    readonly productQuantity: Locator;
    readonly checkoutBtn: Locator;

    constructor(page: Page){
        super(page);
        this.productName = page.locator("//a[@class = 'product-title']");
        this.productPrice = page.locator("//td[@class = 'product-price']//span//bdi");
        this.productQuantity = page.locator("//td[@class = 'product-quantity']//div//input[@class = 'input-text qty text']");
        this.checkoutBtn = page.locator("//div[@class = 'cart_totals ']//a[@href = 'https://demo.testarchitect.com/checkout/']");
    }

    async getProductName(): Promise<string>{
        await this.productName.scrollIntoViewIfNeeded();
        const name = (await this.productName.innerText()).toLowerCase();
        logger.info(`name: ${name}`);
        return name;  
    }
    
    async getProductPrice(): Promise<number>{
        await this.productPrice.scrollIntoViewIfNeeded();
        const priceText = await this.productPrice.textContent();
        const price = parseFloat(
            priceText!
            .replace('\u00A0', ' ')
            .replace('$', '')
            .replace(',', '')
            .replace(/[^0-9.\-]/g, '')
            .trim()
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
    
    async getMiniProductInfo(): Promise<Product>{
        const name = await this.getProductName();
        const price = await this.getProductPrice();
        const quantity = await  this.getProductQuantity();
        logger.info(`mini product name: ${name}, price: ${price}, quantity: ${quantity}`);
        return {
            name: name,
            price: price,
            quantity: quantity,
        }
    }

    async clickCheckout(): Promise<void>{
        await this.checkoutBtn.scrollIntoViewIfNeeded();
        await this.checkoutBtn.click();
    }
}