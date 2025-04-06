import test from 'node:test';
import BankAccount from '../../pageFactory/apiRepository/BankAccounts.api';
import { expect } from 'playwright/test';
import { faker } from '@faker-js/faker'

const bankName = faker.person.lastName();
const accnumber = faker.number.int({ min: 100000000, max: 999999999 }).toString();
test('Create a Bank account', async () => {
    const bankAccount = await new BankAccount().autheticate(); // Login and get cookie 
    let res = await bankAccount.listAccounts();
    for (let value of res.data.data.listBankAccount) {
        expect(value.accountNumber).not.toEqual(accnumber) // the account number should not exist
    }
    await bankAccount.createAccount(bankName, accnumber, accnumber)
    res = await bankAccount.listAccounts();
    for (let value of res.data.data.listBankAccount) {
        if (value.accountNumber == accnumber) {
        expect(value.accountNumber).toEqual(accnumber)
    }
    }
})

test('Delete a bank account', async () => {
    const bankAccount = await new BankAccount().autheticate();
    let res = await bankAccount.listAccounts();
    for (let value of res.data.data.listBankAccount) {
        if (value.accountNumber == accnumber) {
        await bankAccount.deleteAccount(value.id)
        }
        expect(value.isDeleted).toBeTruthy;
    }
})