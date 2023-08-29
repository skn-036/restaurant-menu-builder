export type Template = {
    id: string;
    content: string;
    demo_content: string;
};

export type RestaurantInformation = {
    name: string;
    description?: string;
    logo?: string;
};

export type Product = {
    id: string;
    name: string;
    price: string | number;
    description?: string;
    logo?: string;
};
