import { Locator, Page } from "@playwright/test";
import { BasePage } from "./base.page";
import { logger } from "../helpers/logger";
import { Product } from "../types/product.type";
import { Billing } from "../types/billing.type";

export class OrderStatusPage extends BasePage{

    readonly productName: Locator;
    readonly productPrice: Locator;
    readonly productQuantity: Locator;
    readonly billingAddress: Locator;
    readonly actualPhone: Locator;
    readonly actualEmail: Locator;
    readonly orderConfirmationMsg: Locator;

    constructor(page: Page){
        super(page);
        this.productName = page.locator("//section[@class = 'woocommerce-order-details']//table//tbody//tr//td//a");
        this.productPrice = page.locator("//td[@class='woocommerce-table__product-total product-total']//span//bdi");
        this.productQuantity = page.locator("//strong[@class='product-quantity']");
        this.billingAddress = page.locator("//section[@class = 'woocommerce-customer-details']//address");
        this.actualPhone = page.locator("//p[@class='woocommerce-customer-details--phone']");
        this.actualEmail = page.locator("//p[@class='woocommerce-customer-details--email']");
        this.orderConfirmationMsg = page.locator("//div[@class = 'woocommerce-order']//p[@class = 'woocommerce-notice woocommerce-notice--success woocommerce-thankyou-order-received']");
    }

    async getProductName(): Promise<string> {
        logger.info('Retrieving product name from order details');
        await this.productName.scrollIntoViewIfNeeded();
        return (await this.productName.innerText()).trim().toLowerCase();
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
        const qtyText = await this.productQuantity.innerText();
        
        const qty = parseInt(qtyText.replace('×', '').trim());
        logger.info(`Quantity: ${qty}`);
        return qty;
    }

    async getOrderedProductInfo(): Promise<Product> {
        await this.orderConfirmationMsg.waitFor({ state: 'visible' });
        const name = await this.getProductName();
        const price = await this.getProductPrice();
        const quantity = await this.getProductQuantity();
        logger.info(`ordered product name: ${name}, price: ${price}, quantity: ${quantity}`);
        return { name, price, quantity };
}

    async getBillingInfo(): Promise<Billing> {
        const addressText = await this.billingAddress.innerText();
        const parts = addressText.split('\n');
        const [firstName, lastName] = parts[0].trim().split(' ');
        const phoneNumber = (await this.actualPhone.innerText()).trim();
        const email = (await this.actualEmail.innerText()).trim();

        logger.info(`billing info — name: ${firstName} ${lastName}, address: ${parts[1].trim()}, city: ${parts[2].trim()}, country: ${parts[3].trim()}, phone: ${phoneNumber}, email: ${email}`);

        return {
            firstName,
            lastName,
            fullName: parts[0].trim(),
            address: parts[1].trim(),
            city: parts[2].trim(),
            country: parts[3].trim(),
            phoneNumber,
            email,
        };
    }

    async getConfirmationMsg(): Promise<string>{
        return await this.orderConfirmationMsg.innerText();
    }
}