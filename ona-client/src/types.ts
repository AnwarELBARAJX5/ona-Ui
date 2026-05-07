export type CartItem = {
    id: number;
    name: string;
    price: number;
    qty: number;
};

export type Customer = {
    id: string;
    name: string;
    phone: string;
    points: number;
};

export type Order = {
    id: string;
    date: Date;
    items: CartItem[];
    total: number;
    customer: Customer | null;
    paymentMethod: string;
    change: number;
    status: 'pending' | 'completed';
};