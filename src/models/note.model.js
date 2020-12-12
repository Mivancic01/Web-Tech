import { User } from "./user.model";

export class Note {
    id = 0;
    title = '';
    text = '';
    color = '';
    user = new User();

    constructor(title, text, color) {
        this.title = title;
        this.text = text;
        this.color = color;
    }
}