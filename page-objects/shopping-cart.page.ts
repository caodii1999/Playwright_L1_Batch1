import { logger } from "../helpers/logger";
import { Product } from "../types/product.type";
import { BasePage } from "./base.page";

export class ShoppingCartPage extends BasePage {
  readonly productsNames = this.el(
    "//table[@class = 'shop_table shop_table_responsive cart woocommerce-cart-form__contents']//tbody//tr//td//div//a[@class = 'product-title']",
    "xpath",
  );
  readonly productPrices = this.el(
    "//td[@class = 'product-price']//span//bdi",
    "xpath",
  );
  readonly productQuantities = this.el(
    "//td[@class = 'product-quantity']//div//input[@class = 'input-text qty text']",
    "xpath",
  );
  readonly checkoutBtn = this.el("link:Proceed to checkout", "role");
  readonly clearCartBtn = this.el("Clear shopping cart", "text");
  readonly plusQtyBtn = this.el(
    "//td[@class = 'product-quantity']//div//button[@class = 'plus']",
    "xpath",
  );
  readonly minusQtyBtn = this.el(
    "//td[@class = 'product-quantity']//div//button[@class = 'minus']",
    "xpath",
  );
  readonly subtotalPrice = this.el(
    "//td[@class = 'product-subtotal']//span//bdi",
    "xpath",
  );
  readonly updateCartBtn = this.el("button:Update cart", "role");
  readonly plusBtn = this.el("//span[@class = 'plus']", "xpath");
  readonly minusBtn = this.el("//span[@class = 'minus']", "xpath");
  readonly subTotalLocator = this.el(
    "//td[@class = 'product-subtotal']//span//bdi",
    "xpath",
  );

  async getProductName(): Promise<string> {
    await this.productsNames.scrollIntoViewIfNeeded();
    const name = (await this.productsNames.innerText()).toLowerCase();
    logger.info(`name: ${name}`);
    return name;
  }

  async getProductPrice(): Promise<number> {
    await this.productPrices.scrollIntoViewIfNeeded();
    const priceText = await this.productPrices.textContent();
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
    await this.productQuantities.scrollIntoViewIfNeeded();
    const qtyText = await this.productQuantities.inputValue();

    const qty = parseInt(qtyText.trim());
    logger.info(`Quantity: ${qty}`);
    return qty;
  }

  async getProductSubTotal(): Promise<number> {
    const subTotalText = await this.subTotalLocator.innerText();
    const subTotal = parseFloat(
      subTotalText
        .replace("\u00A0", " ")
        .replace("$", "")
        .replace(",", "")
        .replace(/[^0-9.\-]/g, "")
        .trim(),
    );
    return subTotal;
  }

  async setQuantity(number: number): Promise<void> {
    await this.productQuantities.fill(String(number));
  }

  async isSubTotalValid(): Promise<boolean> {
    const price = await this.getProductPrice();
    const quantity = await this.getProductQuantity();
    const expectedSubTotal = price * quantity;
    const actualSubtotal = await this.getProductSubTotal();
    logger.info(
      `expected subtotal: ${expectedSubTotal}, actual subtotal: ${actualSubtotal}`,
    );
    return actualSubtotal === expectedSubTotal;
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

  async clearCart(): Promise<void> {
    await this.clearCartBtn.scrollIntoViewIfNeeded();
    await this.clearCartBtn.click();
  }

  async isCartEmpty(): Promise<boolean> {
    return this.productsNames.isHidden();
  }

  async clickPlusQty(): Promise<void> {
    await this.plusBtn.click();
  }

  async clickMinusQty(): Promise<void> {
    await this.minusBtn.click();
  }

  async clickUpdateCart(): Promise<void> {
    await this.updateCartBtn.click();
  }
}
