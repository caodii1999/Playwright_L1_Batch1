import { test as base } from './data.fixture';
import { HomePage } from '../page-objects/home.page';
import { AccountPage } from '../page-objects/account.page';
import { ProductPage } from '../page-objects/products.page';
import { Departments } from '../enum/departments.enum';
import { ProductDetailPage } from '../page-objects/product-detail.page';
import { ShoppingCartPage } from '../page-objects/shopping-cart.page';
import { CheckoutPage } from '../page-objects/checkout.page';
import { OrderStatusPage } from '../page-objects/order-status.page';

import { Product } from '../types/product.type';
import { Pages } from '../enum/pages.enum';
import { PaymentMethod } from '../enum/payments.enum';
import { Billing } from '../types/billing.type';

export const test = base.extend<{
    goto: (path?: string) => Promise<void>;
    goToCart: () => Promise<void>;
    login: () => Promise<void>;
    navigateToAccountPage: () => Promise<void>;
    registerAccount: () => Promise<void>;
    navigateToElectronicComponentsSupplies: () => Promise<void>;
    clickListView: () => Promise<void>;
    clickGridView: () => Promise<void>;
    isGridView: () => Promise<boolean>;
    isListView: () => Promise<boolean>;
    selectRandomItem: () => Promise<void>;
    clickOnAddToCart: () => Promise<void>;
    getProductInfo: () => Promise<Product>;
    getMiniProductInfo: () => Promise<Product>;
    clickCheckout: () => Promise<void>;
    isCheckoutPageDisplayed: () => Promise<boolean>;
    getCheckoutProductInfo: () => Promise<Product>;
    fillBillingInfo: () => Promise<void>;
    selectDefaultPaymentMethod: () => Promise<void>;
    selectCheckPaymentMethod: () => Promise<void>;
    selectCODMethod: () => Promise<void>;
    clickPlaceOrder: () => Promise<void>;
    isOrderStatusPageDisplayed: () => Promise<boolean>;
    getOrderedProductInfo: () => Promise<Product>;
    getBillingInfo: () => Promise<Billing>;
    getConfirmationMsg: () => Promise<string>;
    navigateToShopPage: () => Promise<void>;
    selectRandomMultipleItemsAndGetInfo: (count: number) => Promise<Product[]>;
}>({
    goto: async ({ page }, use) => {
        const homePage = new HomePage(page);
        await use(async (path = '/') => {
            await homePage.goto(path);
        });
    },

    goToCart: async({page}, use) => {
        const homePage = new HomePage(page);
        await use(async () => {
            await homePage.goToCart();
            await page.reload();
        });
    },

    login: async ({ page, user }, use) => {
        const accountPage = new AccountPage(page);
        await use(async () => {
            await accountPage.login(user.username, user.password);
        });
    },

    navigateToAccountPage: async ({ page }, use) => {
        const homePage = new HomePage(page);
        await use(async () => {
            await homePage.navigateToAccountPage();
        });
    },

    registerAccount: async ({ page, user, mail }, use) => {
        const accountPage = new AccountPage(page);
        await use(async () => {
            await accountPage.register(user.username);
            const resetUrl = await mail.getResetPasswordUrl();
            await page.goto(resetUrl);
            await accountPage.enterNewPassword(user.password);
        });
    },

    navigateToElectronicComponentsSupplies: async ({page}, use) => {
        const accountPage = new AccountPage(page);
        await use(async() => {
            await accountPage.navigateToDeparment(Departments.ELECTRONIC_COMPONENT);
        });
    },

    clickListView: async({page}, use) => {
        const productPage = new ProductPage(page);
        await use(async () =>{
            await productPage.clickListView();
        });
    },

    clickGridView: async({page}, use) => {
        const productPage = new ProductPage(page);
        await use(async () =>{
            await productPage.clickGridView();
        });
    },

    isGridView: async({page}, use) => {
        const productPage = new ProductPage(page);
        await use(async() =>{
            return await productPage.isGridView();
        });
    },

    isListView: async({page}, use) => {
        const productPage = new ProductPage(page);
        await use(async() =>{
            return await productPage.isListView();
        });
    },

    selectRandomItem: async({page}, use) => {
        const productPage = new ProductPage(page);
        await use(async() => {
            await productPage.selectRandomItem();
        });
    },

    clickOnAddToCart: async ({page}, use) => {
        const productDetailPage = new ProductDetailPage(page);
        await use(async() => {
            await productDetailPage.clickOnAddToCart();
        });
    },

    getProductInfo: async ({page}, use) => {
        const productDetailPage = new ProductDetailPage(page);
        await use(async() => {
            return await productDetailPage.getProductInfo();
        });
    },

    getMiniProductInfo: async ({page}, use) => {
        const shoppingCartPage = new ShoppingCartPage(page);
        await use(async() =>{
            return await shoppingCartPage.getMiniProductInfo();
        });
    },

    clickCheckout: async ({page}, use) => {
        const shoppingCartPage = new ShoppingCartPage(page);
        await use(async() => {
            await shoppingCartPage.clickCheckout();
        });
    },

    isCheckoutPageDisplayed: async ({page}, use) => {
        const checkoutPage = new CheckoutPage(page);
        await use(async() => {
            return await checkoutPage.isPageDisplayed(Pages.CHECKOUT);
        });
    },

    getCheckoutProductInfo: async ({page}, use) => {
        const checkoutPage = new CheckoutPage(page);
        await use(async() => {
            return await checkoutPage.getCheckoutProductInfo();
        });
    },

    fillBillingInfo: async ({page, billing}, use) => {
        const checkoutPage = new CheckoutPage(page);
        await use(async() =>{
            await checkoutPage.fillBillingInfo(billing);
        });
    },

    selectDefaultPaymentMethod: async({page}, use) => {
        const checkoutPage = new CheckoutPage(page);
        await use(async() =>{
            await checkoutPage.selectPaymentMethod(PaymentMethod.DIRECT_BANK_TRANSFER);
        });
    },

    selectCheckPaymentMethod: async({page}, use) => {
        const checkoutPage = new CheckoutPage(page);
        await use(async() =>{
            await checkoutPage.selectPaymentMethod(PaymentMethod.CHECK_PAYMENTS);
        });
    },

    selectCODMethod: async({page}, use) => {
        const checkoutPage = new CheckoutPage(page);
        await use(async() =>{
            await checkoutPage.selectPaymentMethod(PaymentMethod.COD);
        });
    },

    clickPlaceOrder: async({page}, use) => {
        const checkoutPage = new CheckoutPage(page);
        await use(async() => {
            await checkoutPage.clickPlaceOrder();
        });
    },

    isOrderStatusPageDisplayed: async ({page}, use) => {
        const orderStatusPage = new OrderStatusPage(page);
        await use(async() => {
            await orderStatusPage.waitForPage();
            return await orderStatusPage.isPageDisplayed(Pages.ORDER_STATUS);
        });
    },

    getOrderedProductInfo: async ({page}, use) => {
        const orderStatusPage = new OrderStatusPage(page);
        await use(async() =>{
            return await orderStatusPage.getOrderedProductInfo();
        });
    },

    getBillingInfo: async ({page}, use) => {
        const orderStatusPage = new OrderStatusPage(page);
        await use(async() =>{
            return await orderStatusPage.getBillingInfo();
        });
    },

    getConfirmationMsg: async ({page}, use) => {
        const orderStatusPage = new OrderStatusPage(page);
        await use(async() => {
            return await orderStatusPage.getConfirmationMsg();
        });
    },

    navigateToShopPage: async ({page}, use) => {
        const accountPage = new AccountPage(page);
        await use(async() => {
            await accountPage.navigateToPage(Pages.SHOP);
        });
    },

    selectRandomMultipleItemsAndGetInfo: async ({ page }, use) => {
        const productPage = new ProductPage(page);
        await use(async (count: number) => {
            return await productPage.selectRandomMultipleItemsAndGetInfo(count);
        });
    },
});

export { expect } from '@playwright/test';