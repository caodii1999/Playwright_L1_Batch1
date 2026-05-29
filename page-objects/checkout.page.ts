import { Locator, Page } from "@playwright/test";
import { BasePage } from "./base.page";
import { Product } from "../types/product.type";
import { PaymentMethod } from "../enum/payments.enum";
import { logger } from "../helpers/logger";
import { BillingInputs } from "../enum/billing-inputs.enum";
import { Billing } from "../types/billing.type";

export class CheckoutPage extends BasePage {
  readonly productNameAndQuantity: Locator;
  readonly productPrice: Locator;
  readonly productQuantity: Locator;
  readonly countryDropdown: Locator;
  readonly countrySearch: Locator;
  readonly placeOrderBtn: Locator;

  getPaymentMethod(value: string): Locator {
    return this.page.locator(
      `//div[@id='order_review']//div//ul//li//label[contains(text(), "${value}")]`,
    );
  }

  getBillingInput(value: string): Locator {
    return this.page.locator(`//input[@id="${value}"]`);
  }

  constructor(page: Page) {
    super(page);
    this.productNameAndQuantity = page.locator(
      "//div[@id='order_review']//table//tbody//tr//td[@class='product-name']",
    );
    this.productPrice = page.locator("//td[@class='product-total']//span//bdi");
    this.productQuantity = page.locator("//strong[@class='product-quantity']");
    this.countryDropdown = page.locator(
      "//span[@id='select2-billing_country-container']",
    );
    this.placeOrderBtn = page.locator("//button[@id='place_order']");
    this.countrySearch = page.locator(
      "//input[@class='select2-search__field']",
    );
  }

  async getProductName(): Promise<string> {
    const fullName = await this.productNameAndQuantity.innerText();
    const quantityText = (await this.productQuantity.innerText()).toLowerCase();
    return fullName
      .replace(quantityText, "")
      .replace("×", "")
      .toLowerCase()
      .trim();
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

  async getCheckoutProductInfo(): Promise<Product> {
    await this.page.reload();
    const name = await this.getProductName();
    const price = await this.getProductPrice();
    const quantity = await this.getProductQuantity();
    logger.info(
      `ordered product name: ${name}, price: ${price}, quantity: ${quantity}`,
    );
    return {
      name: name,
      price: price,
      quantity: quantity,
    };
  }

  async selectPaymentMethod(payment: PaymentMethod): Promise<void> {
    await this.getPaymentMethod(payment).click();
  }

  async selectCountryDropDown(value: string): Promise<void> {
    await this.countryDropdown.click();
    await this.countrySearch.fill(value);
    await this.countrySearch.press("Enter");
    logger.info(`Selected country: ${value}`);
  }

  async fillBillingInfo(billing: Billing): Promise<void> {
    logger.info(`Filling billing form: ${billing.email}`);
    await this.getBillingInput(BillingInputs.FIRST_NAME).fill(
      billing.firstName,
    );
    await this.getBillingInput(BillingInputs.LAST_NAME).fill(billing.lastName);
    await this.getBillingInput(BillingInputs.ADDRESS).fill(billing.address);
    await this.getBillingInput(BillingInputs.CITY).fill(billing.city);
    await this.getBillingInput(BillingInputs.PHONE).fill(billing.phoneNumber);
    await this.getBillingInput(BillingInputs.EMAIL).fill(billing.email);
    await this.selectCountryDropDown(billing.country);
  }

  async clickPlaceOrder(): Promise<void> {
    await this.placeOrderBtn.click();
  }
}
