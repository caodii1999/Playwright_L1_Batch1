import { BasePage } from "./base.page";
import { logger } from "../helpers/logger";
import { Product } from "../types/product.type";
import { Billing } from "../types/billing.type";
import { Order } from "../types/order.type";

export class OrderStatusPage extends BasePage {
  readonly productName = this.el("//section[@class = 'woocommerce-order-details']//table//tbody//tr//td//a", "xpath");
  readonly productPrice = this.el("//td[@class='woocommerce-table__product-total product-total']//span//bdi", "xpath");
  readonly productQuantity = this.el("//strong[@class='product-quantity']", "xpath");
  readonly billingAddress = this.el("//section[@class = 'woocommerce-customer-details']//address", "xpath");
  readonly actualPhone = this.el("//p[@class='woocommerce-customer-details--phone']", "xpath");
  readonly actualEmail = this.el("//p[@class='woocommerce-customer-details--email']", "xpath");
  readonly orderConfirmationMsg = this.el("//div[@class = 'woocommerce-order']//p[@class = 'woocommerce-notice woocommerce-notice--success woocommerce-thankyou-order-received']", "xpath");
  readonly orderNumberLocator = this.el("//div[@class = 'woocommerce-order-overview-wrapper']//ul//li[contains(text(), 'Order number')]//strong", "xpath");
  readonly orderDateLocator = this.el("//div[@class = 'woocommerce-order-overview-wrapper']//ul//li[contains(text(), 'Date: ')]//strong", "xpath");
  readonly orderTotalLocator = this.el("//div[@class = 'woocommerce-order-overview-wrapper']//ul//li[contains(text(), 'Total: ')]//strong", "xpath");
  readonly orderPaymentMethodLocator = this.el("//div[@class = 'woocommerce-order-overview-wrapper']//ul//li[contains(text(), 'Payment method: ')]//strong", "xpath");
  readonly orderEmailLocator = this.el("//div[@class = 'woocommerce-order-overview-wrapper']//ul//li[contains(text(), 'Email: ')]//strong", "xpath");

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
        .replace(" ", " ")
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
    logger.info(`ordered product name: ${name}, price: ${price}, quantity: ${quantity}`);
    return { name, price, quantity };
  }

  async getBillingInfo(): Promise<Billing> {
    const addressText = await this.billingAddress.innerText();
    const parts = addressText.split("\n");
    const [firstName, lastName] = parts[0].trim().split(" ");
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

  async getConfirmationMsg(): Promise<string> {
    return this.orderConfirmationMsg.innerText();
  }

  async getAllOrderedProducts(): Promise<Product[]> {
    logger.info("Reading all products in cart...");
    const count = await this.productName.count();
    const products: Product[] = [];

    for (let i = 0; i < count; i++) {
      const name = (await this.productName.nth(i).innerText()).toLowerCase().trim();
      const priceText = await this.productPrice.nth(i).innerText();
      const price = parseFloat(
        priceText
          .replace(" ", " ")
          .replace("$", "")
          .replace(",", "")
          .replace(/[^0-9.\-]/g, "")
          .trim(),
      );
      const qtyText = await this.productQuantity.nth(i).innerText();
      const quantity = parseInt(qtyText.replace("×", "").trim());
      logger.info(`Item ${i} -> name='${name}', price=${price}, qty=${quantity}`);
      products.push({ name, price, quantity });
    }

    logger.info(`Total items read: ${count}`);
    return products;
  }

  async getOrderNumber(): Promise<number> {
    await this.orderNumberLocator.waitFor({ state: "visible" });
    return parseFloat((await this.orderNumberLocator.innerText()).trim());
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
        .replace(" ", " ")
        .replace("$", "")
        .replace(",", "")
        .replace(/[^0-9.\-]/g, "")
        .trim(),
    );
  }

  async getOrderPaymentMethod(): Promise<string> {
    return this.orderPaymentMethodLocator.innerText();
  }

  async getOrderEmail(): Promise<string> {
    return this.orderEmailLocator.innerText();
  }

  async getOrderInfo(): Promise<Order> {
    logger.info(`Getting order info`);
    const orderNumber = await this.getOrderNumber();
    const date = await this.getOrderDate();
    const total = await this.getOrderTotal();
    logger.info(`Received order: number: ${orderNumber}, date: ${date}, total: ${total}`);
    return { orderNumber, date, total };
  }
}
