export class User {
    constructor(private name: string) { }
}

export class Vote {
    constructor(private from: User, private content: string) { }
}

export class BreaktimeVote extends Vote {
    constructor(from: User, content: string) {
        super(from, content);
    }
}