import { Page, Locator } from "@playwright/test";
import { ElementFactory, SelectorType } from "./element-factory";

export class Element {
  private locator: Locator;

  constructor(
    private page: Page,
    private selector: string,
    private type: SelectorType = "label",
    private exact = true,
  ) {
    this.locator = ElementFactory.get(
      this.page,
      this.selector,
      this.type,
      this.exact,
    );
  }

  setDynamic(...args: string[]) {
    this.locator = ElementFactory.get(
      this.page,
      this.selector,
      this.type,
      this.exact,
      ...args,
    );
    return this;
  }

  nth(index: number): Locator {
    return this.locator.nth(index);
  }

  first(): Locator {
    return this.locator.first();
  }

  async click(timeout?: number) {
    await this.locator.click({ timeout });
  }

  async fill(value: string) {
    await this.locator.fill(value);
  }

  async count(): Promise<number> {
    return await this.locator.count();
  }

  async scrollIntoViewIfNeeded() {
    return await this.locator.scrollIntoViewIfNeeded();
  }

  async hover() {
    await this.locator.hover();
  }

  async waitFor(options?: Parameters<Locator["waitFor"]>[0]) {
    await this.locator.waitFor(options);
  }

  async selectOption(value: string) {
    return this.locator.selectOption(value);
  }

  async textContent(): Promise<string | null> {
    return this.locator.textContent();
  }

  async innerText(): Promise<string> {
    return this.locator.innerText();
  }

  async press(key: string): Promise<void> {
    await this.locator.press(key);
  }

  async elementHandle() {
    return this.locator.elementHandle();
  }

  async inputValue(): Promise<string> {
    return this.locator.inputValue();
  }

  async isVisible(): Promise<boolean> {
    return this.locator.isVisible();
  }

  async isHidden(): Promise<boolean>{
    return this.locator.isHidden();
  }
}
