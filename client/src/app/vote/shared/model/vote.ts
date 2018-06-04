import { User } from './user';
import { Action } from './action';

export interface Vote {
    from?: User;
    content?: any;
    action?: Action;
}
