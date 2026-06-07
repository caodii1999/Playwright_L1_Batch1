import { Locator, Page } from "@playwright/test";
import { BasePage } from "./base.page";
import { logger } from "../helpers/logger";
import { Order } from "../types/order.type";
import { User } from "../types/user.type";
import { AccountNavItems } from "../enum/account-nav-items.enum";

export class AccountPage extends BasePage {
  readonly regisEmailTextbox = this.el("textbox:Email address *", "role");
  readonly registerBtn = this.el("button:Register", "role");
  readonly usernameTextbox = this.el("textbox:Username or email address *", "role");
  readonly passwordTextbox = this.el("textbox:Password *", "role");
  readonly loginBtn = this.el("button:Log in", "role");
  readonly newPasswordTextbox = this.el("textbox:New password *", "role");
  readonly reEnterNewPasswordTextbox = this.el("textbox:Re-enter new password *", "role");
  readonly saveBtn = this.el("button:Save", "role");
  readonly orderNumbersLocator= this.el("//table[@class = 'woocommerce-orders-table woocommerce-MyAccount-orders shop_table shop_table_responsive my_account_orders account-orders-table']//tbody//tr/td[@data-title = 'Order']//a", "xpath");
  readonly orderDatesLocator = this.el("//table[@class = 'woocommerce-orders-table woocommerce-MyAccount-orders shop_table shop_table_responsive my_account_orders account-orders-table']//tbody//tr/td[@data-title = 'Date']//time", "xpath");
  readonly orderTotalLocator = this.el("//table[@class = 'woocommerce-orders-table woocommerce-MyAccount-orders shop_table shop_table_responsive my_account_orders account-orders-table']//tbody//tr/td[@data-title = 'Total']//span[@class = 'woocommerce-Price-amount amount']", "xpath");
  readonly dynamicAccountNavItemLocator = this.el("{0}", "text");

  async login(user: User): Promise<void> {
    await this.usernameTextbox.fill(user.username);
    logger.info(`fill username: ${user.username}`);
    await this.passwordTextbox.fill(user.password);
    logger.info(`fill password: ${user.password}`);
    await this.loginBtn.click();
    logger.info(`login button clicked`);
  }

  async logout(): Promise<void>{
    await this.clickAccountNavItems(AccountNavItems.LOGOUT);
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

  async clickAccountNavItems(value: string): Promise<void> {
    await this.dynamicAccountNavItemLocator.setDynamic(value).click();
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
