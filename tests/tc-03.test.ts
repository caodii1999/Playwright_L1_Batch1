import { test, expect } from '../fixtures/index';
import { ORDER_CONFIRMATION_MSG } from '../constants/order-status.constants';

test.describe('Buy item flow', () => {
    test('Direct bank transfer', async ({
        homePage, productPage, productDetailPage,shoppingCartPage, checkoutPage, orderStatusPage,
        goto,
        registerAccount,
        login,
        navigateToShopPage,
        goToCart,
        fillBillingInfo,
        selectDefaultPaymentMethod,
    }) => {
        await goto();
        await homePage.navigateToAccountPage();
        await registerAccount();
        await login();
        await navigateToShopPage();
        await productPage.selectRandomItem();
        await productDetailPage.clickOnAddToCart();
        await goToCart();
        await shoppingCartPage.clickCheckout();
        await fillBillingInfo();
        await selectDefaultPaymentMethod();
        await checkoutPage.clickPlaceOrder();
        expect.soft(await orderStatusPage.getConfirmationMsg()).toEqual(ORDER_CONFIRMATION_MSG);
    });

    test('Check payments', async ({
        homePage, productPage, productDetailPage,shoppingCartPage, checkoutPage, orderStatusPage,
        goto,
        registerAccount,
        login,
        navigateToShopPage,
        goToCart,
        fillBillingInfo,
        selectCheckPaymentMethod,
    }) => {
        await goto();
        await homePage.navigateToAccountPage();
        await registerAccount();
        await login();
        await navigateToShopPage();
        await productPage.selectRandomItem();
        await productDetailPage.clickOnAddToCart();
        await goToCart();
        await shoppingCartPage.clickCheckout();
        await fillBillingInfo();
        await selectCheckPaymentMethod();
        await checkoutPage.clickPlaceOrder();
        expect.soft(await orderStatusPage.getConfirmationMsg()).toEqual(ORDER_CONFIRMATION_MSG);
    });

    test('Cash on delivery', async ({
        homePage, productPage, productDetailPage,shoppingCartPage, checkoutPage, orderStatusPage,
        goto,
        registerAccount,
        login,
        navigateToShopPage,
        goToCart,
        fillBillingInfo,
        selectCODMethod,
    }) => {
        await goto();
        await homePage.navigateToAccountPage();
        await registerAccount();
        await login();
        await navigateToShopPage();
        await productPage.selectRandomItem();
        await productDetailPage.clickOnAddToCart();
        await goToCart();
        await shoppingCartPage.clickCheckout();
        await fillBillingInfo();
        await selectCODMethod();
        await checkoutPage.clickPlaceOrder();
        expect.soft(await orderStatusPage.getConfirmationMsg()).toEqual(ORDER_CONFIRMATION_MSG);
    });
});