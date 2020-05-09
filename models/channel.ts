export interface Topic {
    value: string;
    creator: string;
    last_set: number;
}

export interface Purpose {
    value: string;
    creator: string;
    last_set: number;
}

export interface Channel {
    id: string;
    name: string;
    created: number;
    creator: string;
    is_archived: boolean;
    is_general: boolean;
    members: string[];
    topic: Topic;
    purpose: Purpose;
}

