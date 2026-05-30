import { Locator, Page } from "@playwright/test";
import { BasePage } from "./base.page";
import { logger } from "../helpers/logger";
import { Order } from "../types/order.type";

export class AccountPage extends BasePage {
  readonly regisEmailTextbox: Locator;
  readonly registerBtn: Locator;
  readonly usernameTextbox: Locator;
  readonly passwordTextbox: Locator;
  readonly loginBtn: Locator;
  readonly newPasswordTextbox: Locator;
  readonly reEnterNewPasswordTextbox: Locator;
  readonly saveBtn: Locator;
  readonly orderNumbersLocator: Locator;
  readonly orderDatesLocator: Locator;
  readonly orderTotalLocator: Locator;

  getAccountNavItem(value: string): Locator {
    return this.page.locator(
      `//nav[@class = 'woocommerce-MyAccount-navigation']//ul//li//a[contains(text(), '${value}')]`,
    );
  }

  constructor(page: Page) {
    super(page);
    this.regisEmailTextbox = page.locator("//input[@id = 'reg_email']");
    this.registerBtn = page.getByRole("button", { name: "REGISTER" });
    this.usernameTextbox = page.locator("//input[@id = 'username']");
    this.passwordTextbox = page.locator("//input[@id = 'password']");
    this.loginBtn = page.getByRole("button", { name: "LOG IN" });
    this.newPasswordTextbox = page.locator("//input[@id = 'password_1']");
    this.reEnterNewPasswordTextbox = page.locator(
      "//input[@id = 'password_2']",
    );
    this.saveBtn = page.getByRole("button", { name: "SAVE" });
    this.orderNumbersLocator = page.locator(
      "//table[@class = 'woocommerce-orders-table woocommerce-MyAccount-orders shop_table shop_table_responsive my_account_orders account-orders-table']//tbody//tr/td[@data-title = 'Order']//a",
    );
    this.orderDatesLocator = page.locator(
      "//table[@class = 'woocommerce-orders-table woocommerce-MyAccount-orders shop_table shop_table_responsive my_account_orders account-orders-table']//tbody//tr/td[@data-title = 'Date']//time",
    );
    this.orderTotalLocator = page.locator(
      "//table[@class = 'woocommerce-orders-table woocommerce-MyAccount-orders shop_table shop_table_responsive my_account_orders account-orders-table']//tbody//tr/td[@data-title = 'Total']//span[@class = 'woocommerce-Price-amount amount']",
    );
  }

  async login(username: string, password: string): Promise<void> {
    await this.usernameTextbox.fill(username);
    logger.info(`fill username: ${username}`);
    await this.passwordTextbox.fill(password);
    logger.info(`fill password: ${password}`);
    await this.loginBtn.click();
    logger.info(`login button clicked`);
  }

  async register(username: string): Promise<void> {
    await this.regisEmailTextbox.fill(username);
    logger.info(`fill email: ${username}`);
    await this.registerBtn.click();
    logger.info(`register button clicked`);
  }

  async enterNewPassword(password: string): Promise<void> {
    await this.newPasswordTextbox.fill(password);
    logger.info(`already fill password`);
    await this.reEnterNewPasswordTextbox.fill(password);
    logger.info(`already re-enter password`);
    await this.saveBtn.click();
    logger.info(`Clicked on Save button`);
  }

  async selectAccountNavItems(item: string): Promise<void> {
    await this.getAccountNavItem(item).click();
  }

  async getAllOrderNumber(index: number): Promise<number> {
    await this.orderNumbersLocator.nth(index).scrollIntoViewIfNeeded();
    const numberText = await this.orderNumbersLocator.nth(index).innerText();
    return parseFloat(numberText.replace("#", "").trim());
  }

  async getAllOrderDate(index: number): Promise<string> {
    return (await this.orderDatesLocator.nth(index).innerText()).trim().toLowerCase();
  }

  async getAllOrderTotal(index: number): Promise<number> {
    const totalText = await this.orderTotalLocator.nth(index).innerText();
    return parseFloat(
      totalText
        .replace("\u00A0", " ")
        .replace("$", "")
        .replace(",", "")
        .replace(/[^0-9.\-]/g, "")
        .trim(),
    );
  }

  async getAllOrderInfo(): Promise<Order[]>{
    const count = await this.orderNumbersLocator.count();
    const orders: Order[] = [];

    for(let i = 0; i < count; i++){
      const orderNumber = await this.getAllOrderNumber(i);
      const date  = await this.getAllOrderDate(i);
      const total = await this.getAllOrderTotal(i);

      logger.info(`Get order number: ${orderNumber}, date: ${date}, total: ${total}`);
      orders.push({orderNumber, date, total})
    }
    return orders;
  }
}
