import 'dotenv/config'
import axios, { AxiosError, AxiosInstance } from 'axios';

export default class BankAccount {
    private headers: { Accept: string; 'Accept-Language': string; Cookie: string };
    private userId: string;
    private axiosInstance: AxiosInstance
    username: string | undefined;
    password: string | undefined;
    constructor() {
        const baseURL = process.env.BASE_URL;
        const username = process.env.USERNAME;
        const password = process.env.PASSWORD;
        this.username = username
        this.password = password
        if (!baseURL) {
         throw new Error('BASE_URL environment variable is not defined');
        }
        this.axiosInstance = axios.create({ baseURL });
    }

    async autheticate() {
        let cookie: string[] | undefined;
        const loginHeaders = {
            'Accept': 'application/json, text/plain, */*',
            'Accept-Language': 'en-US,en;q=0.6',}
        const payload = {"type":"LOGIN","username": this.username, "password": this.password}
        try { 
            const res = await this.axiosInstance.post(`/login`, payload, {headers: loginHeaders} )
            cookie = res.headers['set-cookie'];
            this.headers = {
                'Accept': 'application/json, text/plain, */*',
                'Accept-Language': 'en-US,en;q=0.6',
                'Cookie': cookie ? cookie.join('; ') : ''
              }; 
              return this
        }  catch(err) {
            const error = err as Error | AxiosError;
            if (axios.isAxiosError(error)) {
              throw new Error(`Authentication failed: ${error.message}, Status: ${error.response?.status}, Data: ${JSON.stringify(error.response?.data)}`);
            }
            throw new Error(`Authentication failed: ${error.message}`);
        }
    }

    private async _postApi(graphqlQuery: { query: string; variables: {} | { userId: string; bankName: string; accountNumber: string; routingNumber: string; } | { id: string; }; }) {
        try {
        const res = await this.axiosInstance.post(`/graphql`, graphqlQuery, {
                    headers: this.headers })
        return {"status": res.status, "data": res.data};
        }
        catch(err) {
            const error = err as Error | AxiosError;
            if (axios.isAxiosError(error)) {
                throw new Error(`API request failed: ${error.message}, Status: ${error.response?.status}, Data: ${JSON.stringify(error.response?.data)}`);
            }
            throw new Error(`API request failed: ${error.message}`);
    
        }
    }

    async listAccounts() {
        const listQuery = {
            query: `
              query ListBankAccount {
                listBankAccount {
                  id
                  uuid
                  userId
                  bankName
                  accountNumber
                  routingNumber
                  isDeleted
                  createdAt
                  modifiedAt
                }
              }
            `,
            variables: {}
          };

    const res = await this._postApi(listQuery); 
    const accounts = res.data.data.listBankAccount;     
    if (!accounts || accounts.length === 0) {
        throw new Error('No bank accounts found');
      }
    this.userId = res?.data.data.listBankAccount[0].userId
    return res
    }

    async createAccount(bankName: string, accountNumber: string, routingNumber: string) {
        const createAccountQuery = {
            query: `mutation CreateBankAccount($bankName: String!, $accountNumber: String!, $routingNumber: String!) {
                        createBankAccount (
                        bankName: $bankName
                        accountNumber: $accountNumber
                        routingNumber: $routingNumber ) {
                        id
                        uuid
                        userId
                        bankName
                        accountNumber
                        routingNumber
                        isDeleted
                        createdAt
                        }
                    }`,
            variables: {"userId":`${this.userId}`,"bankName":`${bankName}`,"accountNumber":`${accountNumber}`,"routingNumber":`${routingNumber}`}
          }
          await this._postApi(createAccountQuery)
    }

    async deleteAccount(id: any) {
        const createAccountQuery = {
            query: `mutation DeleteBankAccount($id: ID!) {
                    deleteBankAccount(id: $id)
                    }`,
            variables: {"id":`${id}`}
          }
          await this._postApi(createAccountQuery)
    }
}