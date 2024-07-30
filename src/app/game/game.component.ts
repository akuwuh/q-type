import { Component, OnInit, HostListener, ViewChild, ViewChildren, QueryList, ElementRef, afterRender, afterNextRender} from '@angular/core';
import { Word } from '../utils/word';
import { CharState } from '../utils/char';
import { TimerComponent } from '../timer/timer.component';
import { ResultComponent } from '../result/result.component';
import { generateShuffled } from '../utils/wordList';
import { CaretComponent } from '../caret/caret.component';

const WORD_LIST = generateShuffled();
@Component({
  selector: 'app-game',
  standalone: true,
  imports: [TimerComponent, ResultComponent, CaretComponent],
  templateUrl: './game.component.html',
  styleUrl: './game.component.css'
})

export class GameComponent implements OnInit {

    duration: number = 120;
    words: Word[] = [];
    currentWord: number = 0;
    totalCorrect: number = 0; // correct worsds
    totalRaw: number = 0;
    limbo: boolean = false;
    started: boolean = false;
    showResult: boolean = false;
    gameEnded: boolean = false; 

    charInputted: number = 0;
    charCorrect: number = 0;

    currentWordDOM: Element | null = null;
    currentCharDOM: Element | null | undefined = null;

    charTop: number = 0;
    charLeft: number = 0;

    wordDivHeight: number = 0;
    line1Offset: number = 0; 
    line2Offset: number = 0;

    wordsWrapperWidth: number = 0; 
    charSpanWidth: number = 0;
    
    @ViewChild('timer') timer!: TimerComponent; 
    @ViewChild('wordsRef', {static: false}) wordsRef!: ElementRef;
    @ViewChild('caret') caret!: CaretComponent; 
    

    ngOnInit(): void {
        this.generateWords();
        this.viewUpdate();
    
    }
    

    constructor () {
        afterRender(() => {
            if (this.gameEnded === false) {
                this.viewUpdate();
                this.updateCaret();
            }
        });

    }
    

    generateWords(): void {
        for (let i = 0; i < 100; i++) {
            this.words.push(new Word(WORD_LIST[i], 0, 0, i));
        }
        this.words[this.currentWord].isActive = true;
    }

    @HostListener('document:keypress', ['$event']) keyEvent(e: any): void {
        if (!this.gameEnded) {

            // start timer on first key press
            if (!this.started && this.timer) {
                this.timer.startTimer();
                this.started = true;
            }
            // alpha chars only
            if (e.key != " " && e.key != "Enter")  

            {
                this.charInputted++;
                this.words[this.currentWord].addChar(e.key);
                this.words[this.currentWord].update();
                if (this.words[this.currentWord].render[this.words[this.currentWord].lastChar].state === CharState.CORRECT) {
                    this.charCorrect++;
                }
            } 
            else 
            // enter or space
            { 
                if (this.words[this.currentWord].lastChar != -1) {
                    this.totalCorrect += 2 + this.words[this.currentWord].lastChar; // account for space and 0-indexed
                    this.totalRaw += 2 + this.words[this.currentWord].lastChar;

                    this.words[this.currentWord].isActive = false;
                    this.currentWord++;
                    this.words[this.currentWord].isActive = true;
                }
                
            }
            
        }
    }

    @HostListener('document:keydown', ['$event']) backspaceEvent(e: any): void {
        if (!this.gameEnded) {
            if (e.keyCode === 8) { // is backspace
                if (this.words[this.currentWord].lastChar === -1 && this.currentWord > 0 && this.words[this.currentWord - 1].isCorrect === false) {
                    
                    this.words[this.currentWord].isActive = false;
                    this.currentWord--;
                    this.words[this.currentWord].isActive = true;

                } else {
                    this.words[this.currentWord].removeChar();
                }
                
            }
            this.words[this.currentWord].update();
    
        }
    }

    @HostListener('window:resize', ['$event'])
        onResize(e: any): void{
            this.viewUpdate();
        }

    onTimerFinished() {
        this.started = false;
        this.gameEnded = true;
    }

   

    updateCaret(): void {
        this.caret.updatePosition(this.charLeft, this.charTop);
    }

    viewUpdate(): void {
        this.currentWordDOM = this.wordsRef?.nativeElement.children.item(this.currentWord);

        if (this.currentWordDOM && this.words[this.currentWord].lastChar > -1) {
            this.currentCharDOM = this.currentWordDOM?.children.item(this.words[this.currentWord].lastChar);
        } else {
            this.currentCharDOM = this.currentWordDOM?.children.item(0);
        }

        const charPOS = this.currentCharDOM as HTMLElement;
        const wordPOS = this.currentWordDOM as HTMLElement;

        this.charTop = wordPOS?.offsetTop!;
        this.charLeft = charPOS?.offsetLeft! + wordPOS?.offsetLeft!;

        if (this.words[this.currentWord].lastChar > -1) {
            this.charLeft += charPOS?.offsetWidth!;
        }  

        this.wordsWrapperWidth = this.wordsRef?.nativeElement.offsetWidth!;
        this.charSpanWidth = charPOS?.offsetWidth!;

        console.log(this.wordsWrapperWidth);
        console.log(this.charLeft);

        this.wordDivHeight = this.wordsRef?.nativeElement.children[0].offsetHeight!;
        this.line1Offset = this.wordsRef?.nativeElement.children[0].offsetTop!;
        this.line2Offset = this.line1Offset*3 + this.wordDivHeight; 
        
    }


    // checkRenderLimit(): void { 
    //     if (this.charLeft + this.)
    // }

}
