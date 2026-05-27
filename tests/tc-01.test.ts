import { test, expect } from '../fixtures/index';
import { ORDER_CONFIRMATION_MSG } from '../constants/order-status.constants';

test('Verify users can buy an item successfully', async ({
    homePage, productPage, productDetailPage,shoppingCartPage, checkoutPage, orderStatusPage,
    expectedBilling,
    goto,
    goToCart,
    registerAccount,
    login,
    navigateToElectronicComponentsSupplies,
    isCheckoutPageDisplayed,
    fillBillingInfo,
    selectDefaultPaymentMethod,
    isOrderStatusPageDisplayed,
}) => {
    await test.step("1. Open browser and go to https://demo.testarchitect.com/", async() =>{
        await goto();
    });
        
    await test.step("2. Login with valid credentials ", async() => {
        await homePage.navigateToAccountPage();
        await registerAccount();
        await login();
    });

    await test.step("3. Navigate to All departments section, 4. Select Electronic Components & Supplies", async() =>{
        await navigateToElectronicComponentsSupplies();
    });

    await test.step("5. Verify the items should be displayed as a grid", async() =>{
        await productPage.clickGridView();
        expect.soft(await productPage.isGridView(), 'Grid view should be active').toBeTruthy();
    });
   
    await test.step("6. Switch view to list", async() =>{
        await productPage.clickListView();     
    });

    await test.step("7. Verify the items should be displayed as a list", async() =>{
        expect.soft(await productPage.isListView(), 'List view should be active').toBeTruthy();  
    });

    await test.step("8. Select any item randomly to purchase", async() =>{
        await productPage.selectRandomItem();    
    });

    await test.step("9. Click 'Add to Cart'", async() =>{
        await productDetailPage.clickOnAddToCart();    
    });

    const expectedProductInfo = await productDetailPage.getProductInfo();

    await test.step("10. Go to the cart", async() =>{
        await goToCart();   
    });

    await test.step("11. Verify item details in mini content", async() =>{
        expect.soft(await shoppingCartPage.getMiniProductInfo(), 'Mini cart product should match').toEqual(expectedProductInfo); 
    });

    await test.step("12. Click on Checkout", async() =>{
        await shoppingCartPage.clickCheckout();  
    });

    await test.step("13. Verify Checkbout page displays", async() =>{
        expect.soft(await isCheckoutPageDisplayed(), 'Checkout page should be displayed').toBeTruthy(); 
    });
    
    await test.step("14. Verify item details in order", async() =>{
        expect.soft(await checkoutPage.getCheckoutProductInfo(), 'Checkout product should match').toEqual(expectedProductInfo);  
    });

    await test.step("15. Fill the billing details with default payment method", async() =>{
        await fillBillingInfo();
        await selectDefaultPaymentMethod(); 
    });
    
    await test.step("16. Click on PLACE ORDER", async() =>{
        await checkoutPage.clickPlaceOrder();
    });

    await test.step("17. Verify Order status page displays", async() =>{
        expect.soft(await isOrderStatusPageDisplayed(), 'Order status page should be displayed').toBeTruthy();
    });

    await test.step("18. Verify the Order details with billing and item information", async() =>{
        expect.soft(await orderStatusPage.getOrderedProductInfo(), 'Ordered product should match').toEqual(expectedProductInfo);
        expect.soft(await orderStatusPage.getBillingInfo(), 'Billing info should match').toEqual(expectedBilling);
    });

    await test.step("Expected Result: Order confirmation message show correctly", async() =>{
        expect.soft(await orderStatusPage.getConfirmationMsg()).toEqual(ORDER_CONFIRMATION_MSG);
    });
});