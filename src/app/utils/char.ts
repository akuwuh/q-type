export enum CharState {
    CORRECT = "char-correct",
    INCORRECT = "char-incorrect", 
    DEFAULT = "char-default"
}

export class Char {
    value: string;
    state: CharState;
    
    constructor (value: string, state: CharState) {
        this.value = value;
        this.state = state;
    }  
    
    setState(state: CharState): void {
        this.state = state;
    }

    setValue(value: string): void {
        this.value = value;
    }
}