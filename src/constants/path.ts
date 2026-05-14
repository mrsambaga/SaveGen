import { SAVEGEN_API } from '@env';

export const path = {
    GET_TRANSACTIONS: `${SAVEGEN_API}/transactions`,
    CREATE_TRANSACTION: `${SAVEGEN_API}/transactions`,
    DELETE_TRANSACTION: `${SAVEGEN_API}/transactions`,
    GET_USER: `${SAVEGEN_API}/users/{email}`,
    UPDATE_USER: `${SAVEGEN_API}/users/{email}`,

    REGISTER: `${SAVEGEN_API}/auth/register`,
    LOGIN: `${SAVEGEN_API}/auth/login`,
    GUEST: `${SAVEGEN_API}/auth/guest`,
    GOOGLE_LOGIN: `${SAVEGEN_API}/auth/google`,
    ME: `${SAVEGEN_API}/auth/me`,
};
