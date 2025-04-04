import { test, expect } from '@playwright/test';


test('test', async ({ page }) => {
    await page.locator('[data-test="sidenav-bankaccounts"]').click();
    await page.locator('[data-test="bankaccount-new"]').click();
    await page.getByRole('textbox', { name: 'Bank Name' }).click();
    await page.getByRole('textbox', { name: 'Bank Name' }).fill('New account');
    await page.getByRole('textbox', { name: 'Bank Name' }).press('Tab');
    await page.getByRole('textbox', { name: 'Routing Number' }).fill('123');
    await page.getByText('Must contain a valid routing').click();
    await page.getByRole('textbox', { name: 'Routing Number' }).click();
    await page.getByRole('textbox', { name: 'Routing Number' }).fill('123456789');
    await page.getByRole('textbox', { name: 'Account Number' }).click();
    await page.getByRole('textbox', { name: 'Account Number' }).fill('1234');
    await page.getByText('Must contain at least 9 digits').click();
    await page.getByRole('textbox', { name: 'Account Number' }).click();
    await page.getByRole('textbox', { name: 'Account Number' }).fill('123456789');
    await page.locator('[data-test="bankaccount-submit"]').click();
    await page.getByText('New account').click();
    await page.getByText('New account Delete').click();
    await page.locator('[data-test="bankaccount-list-item-xfKikDTWC"] [data-test="bankaccount-delete"]').click();
    await page.getByText('New account (Deleted)').click();
    await page.locator('[data-test="sidenav-user-settings"]').click();
    await page.locator('[data-test="sidenav-notifications"]').click();
    await page.getByText('Kristian Bradtke liked a').click();
    await page.locator('[data-test="sidenav-toggle"]').click();
    await page.locator('[data-test="sidenav"]').click();
    await page.locator('[data-test="sidenav-toggle"]').click();
    await page.locator('[data-test="sidenav-home"]').click();
    await page.locator('[data-test="nav-contacts-tab"]').click();
    await page.locator('[data-test="nav-personal-tab"]').click();
    await page.locator('[data-test="nav-top-new-transaction"]').click();
});