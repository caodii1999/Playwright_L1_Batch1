import { Page, Locator } from "@playwright/test";

export type SelectorType = "label" | "role" | "text" | "xpath";

export class ElementFactory {
  static get(
    page: Page,
    selector: string,
    type: SelectorType,
    exact = true,
    ...args: string[]
  ): Locator {
    let finalSelector = selector;
    args.forEach((val, index) => {
      finalSelector = finalSelector.replace(`{${index}}`, val);
    });

    switch (type) {
      case "label":
        return page.getByLabel(finalSelector, { exact });
      case "role": {
        const [role, name] = finalSelector.includes(":")
          ? finalSelector.split(":")
          : ["button", finalSelector];
        return page.getByRole(role as any, { name, exact });
      }
      case "text":
        return page.getByText(finalSelector, { exact });
      case "xpath":
        return page.locator(`xpath = ${finalSelector}`);
      default:
        return page.getByLabel(finalSelector, { exact });
    }
  }
}
