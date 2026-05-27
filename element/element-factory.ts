import { Page, Locator } from "@playwright/test";

export type SelectorType = 'label' | 'role' | 'text' | 'xpath';

export class ElementFactory{
    static get(page: Page, selector: string, type: SelectorType, ...args: string[]): Locator {
        let finalSelector = selector;
        args.forEach((val, index) => {
            finalSelector = finalSelector.replace(`{${index}`, val);
        });

        switch (type){
            case 'label': return page.getByLabel(finalSelector);
            case 'role': 
                const [role, name] = finalSelector.includes(':')
        }
    }
}