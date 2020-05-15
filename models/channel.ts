export interface Topic {
    value: string;
    creator: string;
    lastSet: number;
}

export interface Purpose {
    value: string;
    creator: string;
    lastSet: number;
}

export interface Channel {
    id: string;
    name: string;
    created: number;
    creator: string;
    isArchived: boolean;
    isGeneral: boolean;
    members: string[];
    topic: Topic;
    purpose: Purpose;
}
