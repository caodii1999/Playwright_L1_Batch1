import { mergeTests } from "@playwright/test";
import { test as pageTest } from "./page.fixture";
import { test as actionTest } from "./action.fixture";

export const test = mergeTests(pageTest, actionTest);
export { expect } from "@playwright/test";