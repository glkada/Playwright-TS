import { Page, expect } from '@playwright/test';
import { PaymentObjects } from '../objectRepository/payments.object';
import { PaymentsData } from '../../testData/payments.data';
import { graphql } from 'graphql';
import axios from 'axios'

export class Payments {
    readonly page: Page;
    
    constructor(page: Page) {
        this.page = page
    }
    async createNewTransaction() {
        await this.page.locator(PaymentObjects.newTransactionBtn).click()
        await this.page.getByText(PaymentsData.contactToPay).click();
        await expect(this._checkIfButtonDisabled(PaymentObjects.requestPaymentBtn)).toBeTruthy()
    }

    async negativeCasesUi() {
        await this.page.locator(PaymentObjects.newTransactionBtn).click()
        await this.page.getByText(PaymentsData.contactToPay).click();
        let amount =  this.page.getByRole('textbox', { name: 'Amount' });
        let descriptionBox = this.page.getByRole('textbox', { name: 'Add a note' });
        let invalidAmount = ['-', '.'];
        await amount.click();
        await descriptionBox.click();
        await expect(this.page.locator(PaymentObjects.amountTextBoxError)).toBeVisible();
        await amount.click();
        await expect(this.page.locator(PaymentObjects.descriptionTextBox)).toBeVisible();
        for (const char of invalidAmount) {
            await amount.fill(char);
            await expect(this.page.locator(`//p[contains(text(), "${char}")]`)).toBeVisible();
        }
        await amount.fill(PaymentsData.amountInDollars);
        await expect(this.page.locator(PaymentObjects.requestPaymentBtn)).toBeDisabled();
        await expect(this.page.locator(PaymentObjects.doPaymentBtn)).toBeDisabled();
        await amount.fill('');
        await descriptionBox.fill(PaymentsData.description);
        await expect(this.page.locator(PaymentObjects.requestPaymentBtn)).toBeDisabled();
        await expect(this.page.locator(PaymentObjects.doPaymentBtn)).toBeDisabled();
    }

    async completePayment() {
        await this.page.getByText(PaymentsData.contactToPay).click();
        await this.page.locator(PaymentObjects.amountTextBox).fill(PaymentsData.amountInDollars);
        await this.page.locator(PaymentObjects.noteTextBox).fill(PaymentsData.description);
        await this.page.locator(PaymentObjects.doPaymentBtn).click();
        await this.page.waitForResponse(response => response.url().includes(`/transaction`) && response.status() == 200, {timeout: 30000});
    }

    private async _checkIfButtonDisabled(locator) {
        return await expect(this.page.locator(locator)).toBeDisabled();
    }
}

        