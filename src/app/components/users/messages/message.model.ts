export class Message {
    sender: string;
    reciver: string[];
    date: Date;
    title?: string;
    body?: string;
    button?: string;
    url?: string;
    id?: string;
    new: boolean;
}
