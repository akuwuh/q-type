import { Char, CharState } from './char';

export class Word {
    private value: string;
    input: string = "";
    isCorrect: boolean = false;
    render: Char[] = []; 
    private len: number; 
    lastChar: number = -1; // empty string

    globalIdx: number; // index of word in the whole text
    lineIdx: number; // index of line it belongs to
    localIdx: number; // index of word in the line  

    constructor(value: string, lineIdx: number, localIdx: number, globalIdx: number,) {
        this.value = value;
        this.globalIdx = globalIdx;
        this.lineIdx = lineIdx;
        this.localIdx = localIdx;
        this.len = value.length;

        for (let i = 0; i < this.len; i++) {
            this.render.push(new Char(this.value[i], CharState.DEFAULT)); 
        }
    }

    addChar(char: string): void {
        if (this.lastChar < this.len + 7) { // length check
            this.input += char;
            this.lastChar++;
        }
    }

    removeChar(): void {
        if (this.lastChar > -1) {
            this.input = this.input.slice(0, this.lastChar);
            this.lastChar--;
        }
    }

    update(): void {
        const inputLen = this.input.length;
        const renderLen = this.render.length;
        
        if (this.input === this.value) {
            this.isCorrect = true;
        } else {
            this.isCorrect = false;
        }

        if (renderLen > inputLen  && renderLen > this.len) {
            if (inputLen > this.len) {
                this.render.splice(inputLen , renderLen - inputLen);
            } else {
                this.render.splice(this.len, renderLen - this.len);
            }
        }
        for (let i = 0; i < Math.max(inputLen, this.len); i++) {
            if (inputLen < this.len && i > inputLen - 1) {
                this.render[i].state = CharState.DEFAULT;
                continue; 
            }
            
            if (renderLen < i + 1) {
                this.render.push(new Char(this.input[i], CharState.INCORRECT)); 
                continue;
            }

            // within bounds
            if (this.input[i] === this.value[i]) {
                this.render[i].state = CharState.CORRECT;
            } else {
                this.render[i].state = CharState.INCORRECT;
            }
        }

    }

   
}