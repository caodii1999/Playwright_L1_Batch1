import { Locator, Page } from "@playwright/test";
import { BasePage } from "./base.page";
import { logger } from "../helpers/logger";

export class AccountPage extends BasePage {
  readonly regisEmailTextbox: Locator;
  readonly registerBtn: Locator;
  readonly usernameTextbox: Locator;
  readonly passwordTextbox: Locator;
  readonly loginBtn: Locator;
  readonly newPasswordTextbox: Locator;
  readonly reEnterNewPasswordTextbox: Locator;
  readonly saveBtn: Locator;

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
}
