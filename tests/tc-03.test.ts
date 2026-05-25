import { test, expect } from '../fixtures/action.fixture';
import { ORDER_CONFIRMATION_MSG } from '../constants/order-status.constants';

test.describe('Buy item flow', () => {
    test('Direct bank transfer', async ({
        goto,
        registerAccount,
        navigateToAccountPage,
        login,
        navigateToShopPage,
        selectRandomItem,
        clickOnAddToCart,
        goToCart,
        clickCheckout,
        fillBillingInfo,
        selectDefaultPaymentMethod,
        clickPlaceOrder,
        getConfirmationMsg,
    }) => {
        await goto();
        await navigateToAccountPage();
        await registerAccount();
        await login();
        await navigateToShopPage();
        await selectRandomItem();
        await clickOnAddToCart();
        await goToCart();
        await clickCheckout();
        await fillBillingInfo();
        await selectDefaultPaymentMethod();
        await clickPlaceOrder();
        expect.soft(await getConfirmationMsg()).toEqual(ORDER_CONFIRMATION_MSG);
    });

    test('Check payments', async ({
        goto,
        registerAccount,
        navigateToAccountPage,
        login,
        navigateToShopPage,
        selectRandomItem,
        clickOnAddToCart,
        goToCart,
        clickCheckout,
        fillBillingInfo,
        selectCheckPaymentMethod,
        clickPlaceOrder,
        getConfirmationMsg,
    }) => {
        await goto();
        await navigateToAccountPage();
        await registerAccount();
        await login();
        await navigateToShopPage();
        await selectRandomItem();
        await clickOnAddToCart();
        await goToCart();
        await clickCheckout();
        await fillBillingInfo();
        await selectCheckPaymentMethod();
        await clickPlaceOrder();
        expect.soft(await getConfirmationMsg()).toEqual(ORDER_CONFIRMATION_MSG);
    });

    test('Cash on delivery', async ({
        goto,
        registerAccount,
        navigateToAccountPage,
        login,
        navigateToShopPage,
        selectRandomItem,
        clickOnAddToCart,
        goToCart,
        clickCheckout,
        fillBillingInfo,
        selectCODMethod,
        clickPlaceOrder,
        getConfirmationMsg,
    }) => {
        await goto();
        await navigateToAccountPage();
        await registerAccount();
        await login();
        await navigateToShopPage();
        await selectRandomItem();
        await clickOnAddToCart();
        await goToCart();
        await clickCheckout();
        await fillBillingInfo();
        await selectCODMethod();
        await clickPlaceOrder();
        expect.soft(await getConfirmationMsg()).toEqual(ORDER_CONFIRMATION_MSG);
    });
});