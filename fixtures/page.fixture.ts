import { test as dataTest } from "./data.fixture";
import { HomePage } from "../page-objects/home.page";
import { AccountPage } from "../page-objects/account.page";
import { ProductPage } from "../page-objects/products.page";
import { ProductDetailPage } from "../page-objects/product-detail.page";
import { ShoppingCartPage } from "../page-objects/shopping-cart.page";
import { CheckoutPage } from "../page-objects/checkout.page";
import { OrderStatusPage } from "../page-objects/order-status.page";

export const test = dataTest.extend<{
  homePage: HomePage;
  accountPage: AccountPage;
  productPage: ProductPage;
  productDetailPage: ProductDetailPage;
  shoppingCartPage: ShoppingCartPage;
  checkoutPage: CheckoutPage;
  orderStatusPage: OrderStatusPage;
}>({
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },

  accountPage: async ({ page }, use) => {
    await use(new AccountPage(page));
  },

  productPage: async ({ page }, use) => {
    await use(new ProductPage(page));
  },

  productDetailPage: async ({ page }, use) => {
    await use(new ProductDetailPage(page));
  },

  shoppingCartPage: async ({ page }, use) => {
    await use(new ShoppingCartPage(page));
  },

  checkoutPage: async ({ page }, use) => {
    await use(new CheckoutPage(page));
  },

  orderStatusPage: async ({ page }, use) => {
    await use(new OrderStatusPage(page));
  },
});
