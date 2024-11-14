import { Base64 } from 'js-base64';
import { Cookies } from 'react-cookie';

const getToken = (name: string) => {
    const cookies = new Cookies(null, { path: '/' });
    const token = cookies.get(name);
    if (token) {
        return encodeToken(token);
    }
    return null;
};

const encodeToken = (token: string) => {
    const base64 = Base64.encode(`${token}:`);

    return `Basic ${base64}`;
};

export { getToken, encodeToken };
