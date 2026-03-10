export type Contact = {
    id: number;
    name: string;
    countryCode: string;
    phone: string;
}

export type Errors = {
    name?: string;
    countryCode?: string;
    phone?: string;
}
