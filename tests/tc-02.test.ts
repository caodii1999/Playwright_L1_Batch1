import { test, expect } from '../fixtures/index';
import { ORDER_CONFIRMATION_MSG } from '../constants/order-status.constants';

test('Verify users can buy multiple item successfully', async ({
    homePage, productPage, productDetailPage,shoppingCartPage, checkoutPage, orderStatusPage,
    goto,
    goToCart,
    registerAccount,
    login,
    navigateToShopPage,
    fillBillingInfo,
    selectDefaultPaymentMethod,
}) => {
    await goto();
    await homePage.navigateToAccountPage();
    await registerAccount();
    await login();
    await navigateToShopPage();
    
    // not yet implemented getMultipleProducts
    await goToCart();
   
    await shoppingCartPage.clickCheckout();
    
    await fillBillingInfo();
    await selectDefaultPaymentMethod();
    await checkoutPage.clickPlaceOrder();

    expect.soft(await orderStatusPage.getConfirmationMsg()).toEqual(ORDER_CONFIRMATION_MSG);
});