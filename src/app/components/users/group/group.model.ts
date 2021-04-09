import { Palet } from 'src/app/shared/color-chooser/color-chooser.component';

export class Group {
    id: string;
    name: string;
    manager: string;
    color?: Palet;
    discription?: string;
    pending?: PendingUsers[];
    
    constructor(){
        this.id = '';
        this.name = '';
        this.name = '';
    }
}

export class PendingUsers {
    email: string;
    status: boolean;
}
