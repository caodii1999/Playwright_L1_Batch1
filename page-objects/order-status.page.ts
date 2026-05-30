import { Locator, Page } from "@playwright/test";
import { BasePage } from "./base.page";
import { logger } from "../helpers/logger";
import { Product } from "../types/product.type";
import { Billing } from "../types/billing.type";
import { Order } from "../types/order.type";

export class OrderStatusPage extends BasePage {
  readonly productName: Locator;
  readonly productPrice: Locator;
  readonly productQuantity: Locator;
  readonly billingAddress: Locator;
  readonly actualPhone: Locator;
  readonly actualEmail: Locator;
  readonly orderConfirmationMsg: Locator;
  readonly orderNumberLocator: Locator;
  readonly orderDateLocator: Locator;
  readonly orderTotalLocator: Locator;
  readonly orderPaymentMethodLocator: Locator;
  readonly orderEmailLocator: Locator;

  constructor(page: Page) {
    super(page);
    this.productName = page.locator(
      "//section[@class = 'woocommerce-order-details']//table//tbody//tr//td//a",
    );
    this.productPrice = page.locator(
      "//td[@class='woocommerce-table__product-total product-total']//span//bdi",
    );
    this.productQuantity = page.locator("//strong[@class='product-quantity']");
    this.billingAddress = page.locator(
      "//section[@class = 'woocommerce-customer-details']//address",
    );
    this.actualPhone = page.locator(
      "//p[@class='woocommerce-customer-details--phone']",
    );
    this.actualEmail = page.locator(
      "//p[@class='woocommerce-customer-details--email']",
    );
    this.orderConfirmationMsg = page.locator(
      "//div[@class = 'woocommerce-order']//p[@class = 'woocommerce-notice woocommerce-notice--success woocommerce-thankyou-order-received']",
    );
    this.orderNumberLocator = page.locator(
      "//div[@class = 'woocommerce-order-overview-wrapper']//ul//li[contains(text(), 'Order number')]//strong",
    );
    this.orderDateLocator = page.locator(
      "//div[@class = 'woocommerce-order-overview-wrapper']//ul//li[contains(text(), 'Date: ')]//strong",
    );
    this.orderTotalLocator = page.locator(
      "//div[@class = 'woocommerce-order-overview-wrapper']//ul//li[contains(text(), 'Total: ')]//strong",
    );
    this.orderPaymentMethodLocator = page.locator(
      "//div[@class = 'woocommerce-order-overview-wrapper']//ul//li[contains(text(), 'Payment method: ')]//strong",
    );
    this.orderEmailLocator = page.locator(
      "//div[@class = 'woocommerce-order-overview-wrapper']//ul//li[contains(text(), 'Email: ')]//strong",
    );
  }

  async getProductName(): Promise<string> {
    logger.info("Retrieving product name from order details");
    await this.productName.scrollIntoViewIfNeeded();
    return (await this.productName.innerText()).trim().toLowerCase();
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
    const qtyText = await this.productQuantity.innerText();

    const qty = parseInt(qtyText.replace("×", "").trim());
    logger.info(`Quantity: ${qty}`);
    return qty;
  }

  async getOrderedProductInfo(): Promise<Product> {
    await this.orderConfirmationMsg.waitFor({ state: "visible" });
    const name = await this.getProductName();
    const price = await this.getProductPrice();
    const quantity = await this.getProductQuantity();
    logger.info(
      `ordered product name: ${name}, price: ${price}, quantity: ${quantity}`,
    );
    return { name, price, quantity };
  }

  async getBillingInfo(): Promise<Billing> {
    const addressText = await this.billingAddress.innerText();
    const parts = addressText.split("\n");
    const [firstName, lastName] = parts[0].trim().split(" ");
    const phoneNumber = (await this.actualPhone.innerText()).trim();
    const email = (await this.actualEmail.innerText()).trim();

    logger.info(
      `billing info — name: ${firstName} ${lastName}, address: ${parts[1].trim()}, city: ${parts[2].trim()}, country: ${parts[3].trim()}, phone: ${phoneNumber}, email: ${email}`,
    );

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

  async getConfirmationMsg(): Promise<string> {
    return await this.orderConfirmationMsg.innerText();
  }

  async getAllOrderedProducts(): Promise<Product[]> {
    logger.info("Reading all products in cart...");
    const count = await this.productName.count();
    const products: Product[] = [];

    for (let i = 0; i < count; i++) {
      const name = (await this.productName.nth(i).innerText())
        .toLowerCase()
        .trim();

      const priceText = await this.productPrice.nth(i).innerText();
      const price = parseFloat(
        priceText
          .replace("\u00A0", " ")
          .replace("$", "")
          .replace(",", "")
          .replace(/[^0-9.\-]/g, "")
          .trim(),
      );
      const qtyText = await this.productQuantity.nth(i).innerText();
      const quantity = parseInt(qtyText.replace("×", "").trim());

      logger.info(
        `Item ${i} -> name='${name}', price=${price}, qty=${quantity}`,
      );
      products.push({ name, price, quantity });
    }

    logger.info(`Total items read: ${count}`);
    return products;
  }

  async getOrderNumber(): Promise<number> {
    await this.orderNumberLocator.waitFor({ state: "visible" });
    const numberText = await this.orderNumberLocator.innerText();
    return parseFloat(numberText.trim());
  }

  async getOrderDate(): Promise<string> {
    await this.orderDateLocator.waitFor({ state: "visible" });
    await this.orderDateLocator.scrollIntoViewIfNeeded();
    return (await this.orderDateLocator.innerText()).toLowerCase();
  }

  async getOrderTotal(): Promise<number> {
    await this.orderTotalLocator.waitFor({ state: "visible" });
    await this.orderTotalLocator.scrollIntoViewIfNeeded();
    const totalText = await this.orderTotalLocator.innerText();
    return parseFloat(
      totalText
        .replace("\u00A0", " ")
        .replace("$", "")
        .replace(",", "")
        .replace(/[^0-9.\-]/g, "")
        .trim(),
    );
  }

  async getOrderPaymentMethod(): Promise<string> {
    return await this.orderPaymentMethodLocator.innerText();
  }

  async getOrderEmail(): Promise<string> {
    return await this.orderEmailLocator.innerText();
  }

  async getOrderInfo(): Promise<Order> {
    logger.info(`Getting order info`);
    const orderNumber = await this.getOrderNumber();
    const orderDate = await this.getOrderDate();
    const orderTotal = await this.getOrderTotal();
    logger.info(
      `Received order: name: ${orderNumber}, date: ${orderDate}, total: ${orderTotal}`,
    );
    return { orderNumber: orderNumber, date: orderDate, total: orderTotal };
  }
}
