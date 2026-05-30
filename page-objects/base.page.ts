import { Locator, Page } from "@playwright/test";
import { logger } from "../helpers/logger";
import { Departments } from "../enum/departments.enum";
import { Pages } from "../enum/pages.enum";

export abstract class BasePage {
  readonly loginSignUpBtn: Locator;
  readonly cartBtn: Locator;
  readonly allDepartmentMenu: Locator;
  readonly cookieAcceptBtn: Locator;
  readonly dismissBanner: Locator;
  readonly productAddedPopup: Locator;
  readonly cartQuantity: Locator;

  getDepartmentMenu(value: string): Locator {
    return this.page.locator(
      `//div[@class = 'secondary-menu-wrapper']//div[ul[@id = 'menu-all-departments-1']]//li[a[contains(text(), '${value}')]]`,
    );
  }

  getNavItem(value: string): Locator {
    return this.page.locator(
      `//ul[@id = 'menu-main-menu-1']//li[a[text() = '${value}']]`,
    );
  }

  constructor(protected page: Page) {
    this.loginSignUpBtn = page.locator("//a[contains(@href,'my-account')]//span[contains(@class,'et-element-label inline-block mob-hide')]");
    this.cartBtn = page.locator(
      "//div[contains(@class,'et_element')]/div[contains(@class,'et_b_header-cart')]/a",
    );
    this.allDepartmentMenu = page.getByText("All departments");
    this.cookieAcceptBtn = page.locator('a:has-text("Ok")');
    this.dismissBanner = page.locator('a:has-text("Dismiss")');
    this.productAddedPopup = page.locator(
      "//div[contains(text(), 'Product added')]",
    );
    this.cartQuantity = page.locator(
      "//div[contains(@class,'et_element')]/div[contains(@class,'et_b_header-cart')]/a/span/span/span[contains(@class, 'et-cart-quantity et-quantity')]",
    );
  }

  async goto(url: string = "/"): Promise<void> {
    await this.page.goto(url);
    logger.info(`Go to ${url}`);
  }

  async navigateToAccountPage(): Promise<void> {
    await this.loginSignUpBtn.click();
    logger.info(`Go to Account Page`);
  }

  async goToCart(): Promise<void> {
    await this.cartBtn.click();
    await this.page.reload();
    logger.info(`Click on Cart button`);
  }

  async navigateToDeparment(department: Departments): Promise<void> {
    await this.allDepartmentMenu.hover();
    await this.getDepartmentMenu(department).click({ delay: 2 });
    logger.info(`Navigate to department: ${department}`);
  }

  async isUrlContained(path: string, timeout = 10_000): Promise<boolean> {
    logger.info(`Navigate to ${path}`);
    try {
      await this.page.waitForURL(`**${path}**`, { timeout });
      return true;
    } catch {
      return false;
    }
  }

  async dismissPopups(): Promise<void> {
    if (await this.dismissBanner.isVisible()) {
      await this.dismissBanner.click();
      logger.info("Dismissed banner");
    }

    if (await this.cookieAcceptBtn.isVisible()) {
      await this.cookieAcceptBtn.click();
      logger.info("Accepted cookie");
    }
  }

  async navigateToPage(page: Pages): Promise<void> {
    return this.getNavItem(page).click();
  }

  async waitForProductAddedPopupDisappear(): Promise<void> {
    this.productAddedPopup.waitFor({ state: "hidden" });
  }
}
