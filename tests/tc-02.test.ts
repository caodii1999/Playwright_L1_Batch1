import { test, expect } from '../fixtures/action.fixture';
import { ORDER_CONFIRMATION_MSG } from '../constants/order-status.constants';

test('Verify users can buy multiple item successfully', async ({
    goto,
    goToCart,
    registerAccount,
    navigateToAccountPage,
    login,
    navigateToShopPage,
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
    
    // not yet implemented getMultipleProducts
    await goToCart();
   
    await clickCheckout();
    
    await fillBillingInfo();
    await selectDefaultPaymentMethod();
    await clickPlaceOrder();

    expect.soft(await getConfirmationMsg()).toEqual(ORDER_CONFIRMATION_MSG);
});