import { BillingErrors } from "../enum/billing-errors.enum";
import { BillingInputs } from "../enum/billing-inputs.enum";
import { PaymentMethod } from "../enum/payments.enum";
import { logger } from "../helpers/logger";
import { Billing } from "../types/billing.type";
import { Product } from "../types/product.type";
import { BasePage } from "./base.page";

export class CheckoutPage extends BasePage {
  readonly productNameAndQuantity = this.el(
    "//div[@id='order_review']//table//tbody//tr//td[@class='product-name']",
    "xpath",
  );
  readonly productPrice = this.el(
    "//td[@class='product-total']//span//bdi",
    "xpath",
  );
  readonly productQuantity = this.el(
    "//strong[@class='product-quantity']",
    "xpath",
  );
  readonly countryDropdown = this.el(
    "//span[@id='select2-billing_country-container']",
    "xpath",
  );
  readonly countrySearch = this.el(
    "//input[@class='select2-search__field']",
    "xpath",
  );
  readonly placeOrderBtn = this.el("button:Place order", "role");
  readonly dynamicPaymentMethodLocator = this.el("{0}", "label");
  readonly dynamicBillingInputLocator = this.el("//input[@id='{0}']", "xpath");
  readonly billingErrorsContainer = this.el(
    "//ul[@class = 'woocommerce-error']",
    "xpath",
  );
  readonly billingErrorsLocator = this.el(
    "//ul[@class = 'woocommerce-error']//li",
    "xpath",
  );

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
    return { name: name, price: price, quantity: quantity };
  }

  async selectPaymentMethod(payment: PaymentMethod): Promise<void> {
    await this.dynamicPaymentMethodLocator.setDynamic(payment).click();
  }

  async selectCountryDropDown(value: string): Promise<void> {
    await this.countryDropdown.click();
    await this.countrySearch.fill(value);
    await this.countrySearch.press("Enter");
    logger.info(`Selected country: ${value}`);
  }

  async fillBillingInput(value: string, billing: string) {
    return this.dynamicBillingInputLocator.setDynamic(value).fill(billing);
  }

  async fillBillingInfo(billing: Billing): Promise<void> {
    logger.info(`Filling billing form: ${billing.email}`);
    await this.fillBillingInput(BillingInputs.FIRST_NAME, billing.firstName);
    await this.fillBillingInput(BillingInputs.LAST_NAME, billing.lastName);
    await this.fillBillingInput(BillingInputs.ADDRESS, billing.address);
    await this.fillBillingInput(BillingInputs.CITY, billing.city);
    await this.fillBillingInput(BillingInputs.PHONE, billing.phoneNumber);
    await this.fillBillingInput(BillingInputs.EMAIL, billing.email);
    await this.selectCountryDropDown(billing.country);
  }

  async clickPlaceOrder(): Promise<void> {
    await this.placeOrderBtn.click();
  }

  async getErrorsContent(): Promise<string[]> {
    await this.billingErrorsContainer.waitFor({ state: "visible" });
    const count = await this.billingErrorsLocator.count();
    const errors: string[] = [];
    for (let i = 0; i < count; i++) {
      const text = await this.billingErrorsLocator.nth(i).innerText();
      errors.push(text.trim());
    }
    logger.info(`Billing errors: ${errors}`);
    return errors;
  }

  async isErrorMsgMatchMissingField(): Promise<boolean> {
    const actualErrors = await this.getErrorsContent();
    const expectedErrors = Object.values(BillingErrors) as string[];
    return expectedErrors.every((expected) => actualErrors.includes(expected));
  }
}
