export class Message {
    isSystem: boolean;
    content: string;

    constructor(isSystem: boolean, content: string) {
        this.isSystem = isSystem;
        this.content = content;
    };
}