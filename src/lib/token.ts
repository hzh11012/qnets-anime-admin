import { Base64 } from 'js-base64';

const localStorageKey = 'user-store';

const getToken = () => {
    const store = window.localStorage.getItem(localStorageKey)!;
    if (store) {
        const { state } = JSON.parse(store);
        const token = state?.token;
        return token;
    }
    return null;
};

const encodeToken = (token: string) => {
    const base64 = Base64.encode(`${token}:`);

    return `Basic ${base64}`;
};

export { getToken, encodeToken };
