export interface Category {
    id: number;
    name: string;
    slug: string;
}

export interface CreateCategory {
    name: string;
    slug: string;
}

export interface UpdateCategory {
    name: string;
    slug: string;
}
