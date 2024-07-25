import { Char, CharState } from './char';

export class Word {
    value: string;
    input: string = "";
    isActive: boolean = false;
    isCorrect: boolean = false;
    render: Char[] = []; 
    len: number;  

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

    // assume valid input + is not a space
    update(): void {
        const inputLen = this.input.length;
        const renderLen = this.render.length;

        console.log(inputLen)
        console.log(renderLen)

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

        if (this.input === this.value) {
            this.isCorrect = true;
        } else {
            this.isCorrect = false;
        }

    }

   
}