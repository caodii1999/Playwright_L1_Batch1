import { test as base } from './page.fixture';
import { HomePage } from '../page-objects/home.page';
import { AccountPage } from '../page-objects/account.page';
import { ProductPage } from '../page-objects/products.page';
import { Departments } from '../enum/departments.enum';
import { CheckoutPage } from '../page-objects/checkout.page';
import { OrderStatusPage } from '../page-objects/order-status.page';

import { Product } from '../types/product.type';
import { Pages } from '../enum/pages.enum';
import { PaymentMethod } from '../enum/payments.enum';

export const test = base.extend<{
    goto: (path?: string) => Promise<void>;
    goToCart: () => Promise<void>;
    login: () => Promise<void>;
    registerAccount: () => Promise<void>;
    navigateToElectronicComponentsSupplies: () => Promise<void>;
    isCheckoutPageDisplayed: () => Promise<boolean>;
    fillBillingInfo: () => Promise<void>;
    selectDefaultPaymentMethod: () => Promise<void>;
    selectCheckPaymentMethod: () => Promise<void>;
    selectCODMethod: () => Promise<void>;
    isOrderStatusPageDisplayed: () => Promise<boolean>;
    navigateToShopPage: () => Promise<void>;
    selectRandomMultipleItemsAndGetInfo: (count: number) => Promise<Product[]>;
}>({
    goto: async ({homePage}, use) => {
        await use(async (path = '/') => {
            await homePage.goto(path);
        });
    },

    goToCart: async({homePage, page}, use) => {
        await use(async () => {
            await homePage.goToCart();
            await page.reload();
        });
    },

    login: async ({ accountPage, user }, use) => {
        await use(async () => {
            await accountPage.login(user.username, user.password);
        });
    },

    registerAccount: async ({ accountPage, page, user, mail }, use) => {
        await use(async () => {
            await accountPage.register(user.username);
            const resetUrl = await mail.getResetPasswordUrl();
            await page.goto(resetUrl);
            await accountPage.enterNewPassword(user.password);
        });
    },

    navigateToElectronicComponentsSupplies: async ({accountPage}, use) => {
        await use(async() => {
            await accountPage.navigateToDeparment(Departments.ELECTRONIC_COMPONENT);
        });
    },

    isCheckoutPageDisplayed: async ({checkoutPage}, use) => {
        await use(async() => {
            return await checkoutPage.isUrlContained(Pages.CHECKOUT);
        });
    },

    fillBillingInfo: async ({checkoutPage, billing}, use) => {
        await use(async() =>{
            await checkoutPage.fillBillingInfo(billing);
        });
    },

    selectDefaultPaymentMethod: async({checkoutPage}, use) => {
        await use(async() =>{
            await checkoutPage.selectPaymentMethod(PaymentMethod.DIRECT_BANK_TRANSFER);
        });
    },

    selectCheckPaymentMethod: async({checkoutPage}, use) => {
        await use(async() =>{
            await checkoutPage.selectPaymentMethod(PaymentMethod.CHECK_PAYMENTS);
        });
    },

    selectCODMethod: async({checkoutPage}, use) => {
        await use(async() =>{
            await checkoutPage.selectPaymentMethod(PaymentMethod.COD);
        });
    },

    isOrderStatusPageDisplayed: async ({orderStatusPage}, use) => {
        await use(async() => {
            return await orderStatusPage.isUrlContained(Pages.ORDER_STATUS);
        });
    },

    navigateToShopPage: async ({accountPage}, use) => {
        await use(async() => {
            await accountPage.navigateToPage(Pages.SHOP);
        });
    },

    selectRandomMultipleItemsAndGetInfo: async ({productPage}, use) => {
        await use(async (count: number) => {
            return await productPage.selectRandomMultipleItemsAndGetInfo(count);
        });
    },
});

export { expect } from '@playwright/test';