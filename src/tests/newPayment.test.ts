"use strict";
import { test, expect, Page } from '@playwright/test';
import { describe } from 'node:test';
import { Payments } from '../pageFactory/pageRepository/payments';
import { PaymentObjects } from '../pageFactory/objectRepository/payments.object';

describe('Payments page verification @PAYMENTS_SANITY', () => {
    test.beforeEach(async ({page}) => {
        await page.goto('/signin');
        await page.getByRole('textbox', { name: 'Username' }).fill('Heath93');
        await page.getByRole('textbox', { name: 'Password' }).fill('s3cret');
        await page.locator('[data-test="signin-submit"]').click();
        await expect(page.locator('[data-test="transaction-list"]')).toBeVisible();
        await page.locator('[data-test="nav-top-new-transaction"]').click();
    })
    test('Create new transaction default state', async ({ page }) => {
        const paymentsPage = new Payments(page);
        await paymentsPage.createNewTransaction();
        await expect(page.getByText('Please enter a valid amount')).toBeHidden();
        await expect(page.getByText('Please enter a note')).toBeHidden();
        await expect(page.locator(PaymentObjects.doPaymentBtn)).toBeDisabled();
    });
    test('Valid UI errors', async ({ page }) => {
        const paymentsPage = new Payments(page);
        await paymentsPage.negativeCasesUi();
        await expect(page.locator(PaymentObjects.requestPaymentBtn)).toBeDisabled();
        await expect(page.locator(PaymentObjects.doPaymentBtn)).toBeDisabled();
    });

    test('Make payment', async ({page}) => {
        const paymentsPage = new Payments(page);
        await paymentsPage.completePayment();
        await expect(page.getByText('Transaction Submitted!')).toBeVisible()
    })    
   
});
