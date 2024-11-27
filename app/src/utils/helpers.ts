import { v4 as uuidv4 } from 'uuid';

export const generateCartId = (): string => {
    const existingCartId = localStorage.getItem('cartId');
    if (existingCartId) {
        return existingCartId;
    }

    const newCartId = uuidv4();
    localStorage.setItem('cartId', newCartId);
    return newCartId;
};
