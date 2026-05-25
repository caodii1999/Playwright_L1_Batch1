import { test, expect } from '../fixtures/action.fixture';
import { ORDER_CONFIRMATION_MSG } from '../constants/order-status.constants';

test('Verify users can buy an item successfully', async ({
    goto,
    goToCart,
    registerAccount,
    navigateToAccountPage,
    login,
    navigateToElectronicComponentsSupplies,
    clickGridView,
    isGridView,
    clickListView,
    isListView,
    selectRandomItem,
    clickOnAddToCart,
    getProductInfo,
    getMiniProductInfo,
    clickCheckout,
    isCheckoutPageDisplayed,
    getCheckoutProductInfo,
    fillBillingInfo,
    selectDefaultPaymentMethod,
    clickPlaceOrder,
    isOrderStatusPageDisplayed,
    getOrderedProductInfo,
    getBillingInfo,
    expectedBilling,
    getConfirmationMsg,
}) => {
    await test.step("1. Open browser and go to https://demo.testarchitect.com/", async() =>{
        await goto();
    });
        
    await test.step("2. Login with valid credentials ", async() => {
        await navigateToAccountPage();
        await registerAccount();
        await login();
    });

    await test.step("3. Navigate to All departments section, 4. Select Electronic Components & Supplies", async() =>{
        await navigateToElectronicComponentsSupplies();
    });

    await test.step("5. Verify the items should be displayed as a grid", async() =>{
        await clickGridView();
        expect.soft(await isGridView(), 'Grid view should be active').toBeTruthy();
    });
   
    await test.step("6. Switch view to list", async() =>{
        await clickListView();     
    });

    await test.step("7. Verify the items should be displayed as a list", async() =>{
        expect.soft(await isListView(), 'List view should be active').toBeTruthy();  
    });

    await test.step("8. Select any item randomly to purchase", async() =>{
        await selectRandomItem();    
    });

    await test.step("9. Click 'Add to Cart'", async() =>{
        await clickOnAddToCart();    
    });

    const expectedProductInfo = await getProductInfo();

    await test.step("10. Go to the cart", async() =>{
        await goToCart();   
    });

    await test.step("11. Verify item details in mini content", async() =>{
        expect.soft(await getMiniProductInfo(), 'Mini cart product should match').toEqual(expectedProductInfo); 
    });

    await test.step("12. Click on Checkout", async() =>{
        await clickCheckout();  
    });

    await test.step("13. Verify Checkbout page displays", async() =>{
        expect.soft(await isCheckoutPageDisplayed(), 'Checkout page should be displayed').toBeTruthy(); 
    });
    
    await test.step("14. Verify item details in order", async() =>{
        expect.soft(await getCheckoutProductInfo(), 'Checkout product should match').toEqual(expectedProductInfo);  
    });

    await test.step("15. Fill the billing details with default payment method", async() =>{
        await fillBillingInfo();
        await selectDefaultPaymentMethod(); 
    });
    
    await test.step("16. Click on PLACE ORDER", async() =>{
        await clickPlaceOrder();
    });

    await test.step("17. Verify Order status page displays", async() =>{
        expect.soft(await isOrderStatusPageDisplayed(), 'Order status page should be displayed').toBeTruthy();
    });

    await test.step("18. Verify the Order details with billing and item information", async() =>{
        expect.soft(await getOrderedProductInfo(), 'Ordered product should match').toEqual(expectedProductInfo);
        expect.soft(await getBillingInfo(), 'Billing info should match').toEqual(expectedBilling);
    });

    await test.step("Expected Result: Order confirmation message show correctly", async() =>{
        expect.soft(await getConfirmationMsg()).toEqual(ORDER_CONFIRMATION_MSG);
    });
});