import { Page } from "@playwright/test";
import { Element } from "../element/element";
import { SelectorType } from "../element/element-factory";
import { Departments } from "../enum/departments.enum";
import { Pages } from "../enum/pages.enum";
import { logger } from "../helpers/logger";

export abstract class BasePage {
  readonly loginSignUpBtn = this.el(
    "//a[contains(@href,'my-account')]//span[contains(@class,'et-element-label inline-block mob-hide')]",
    "xpath",
  );
  readonly cartBtn = this.el(
    "//div[contains(@class,'et_element')]/div[contains(@class,'et_b_header-cart')]/a",
    "xpath",
  );
  readonly allDepartmentMenu = this.el("All departments", "text");
  readonly dynamicDepartmentItems = this.el(
    "//div[@class = 'secondary-menu-wrapper']//div[ul[@id = 'menu-all-departments-1']]//li[a[contains(text(), '{0}')]]",
    "xpath",
  );
  readonly dynamicPageNavItems = this.el("//ul[@id = 'menu-main-menu-1']//li[a[text() = '{0}']]", "xpath");

  constructor(protected readonly page: Page) {}

  async navigateToPage(page: Pages): Promise<void> {
    await this.dynamicPageNavItems.setDynamic(page).click();
  }

  protected el(selector: string, type?: SelectorType, exact = true): Element {
    return new Element(this.page, selector, type, exact);
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

  async selectDepartmentItem(department: Departments): Promise<void> {
    await this.allDepartmentMenu.hover();
    await this.dynamicDepartmentItems.setDynamic(department).click();
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
}
