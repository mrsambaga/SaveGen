import { SAVEGEN_API } from '@env';

export const path = {
    GET_TRANSACTIONS: `${SAVEGEN_API}/transactions`,
    CREATE_TRANSACTION: `${SAVEGEN_API}/transactions`,
    GET_USER: `${SAVEGEN_API}/users/{email}`,
    UPDATE_USER: `${SAVEGEN_API}/users/{email}`
};