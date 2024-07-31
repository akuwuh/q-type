import { Component, OnInit, HostListener, ViewChild, ViewChildren, QueryList, ElementRef, afterRender, afterNextRender} from '@angular/core';

import { Word } from '../utils/word';
import { CharState } from '../utils/char';
import { TimerComponent } from '../timer/timer.component';
import { ResultComponent } from '../result/result.component';
import { generateShuffled } from '../utils/wordList';
import { CaretComponent } from '../caret/caret.component';
import { trigger, state, style, animate, transition, query, group } from '@angular/animations';


const WORD_LIST = generateShuffled();
@Component({
  selector: 'app-game',
  standalone: true,
  imports: [TimerComponent, ResultComponent, CaretComponent],
  templateUrl: './game.component.html',
  styleUrl: './game.component.css',
  animations: [
    trigger('fadeIn', [
		transition(':enter', [
			style({ opacity: 0 }),
			animate(500, style({ opacity: 1 }))
		]),
	])
  ]
})

export class GameComponent implements OnInit {

    duration: number = 5;
    words: Word[] = [];
    currentWord: number = 0;
    totalCorrect: number = 0; // correct worsds
    totalRaw: number = 0;
    limbo: boolean = false;
    started: boolean = false;
    showResult: boolean = false;
    gameEnded: boolean = false; 
    allowBackspace: boolean = true;

    charInputted: number = 0;
    charCorrect: number = 0;

    currentWordDOM: Element | null = null;
    currentWordWidth: number = 0;
    currentWordLeftOffset: number = 0;

    EOL: boolean = false;

    currentCharDOM: Element | null | undefined = null;

    charTop: number = 0;
    charLeft: number = 0;

    wordDivHeight: number = 0;

    line1Offset: number = 0; 
    line2Offset: number = 0;
    line3Offset: number = 0;

    currentLine: number = 0; 
    nextRemoveIndex: number = 0;

    wordsWrapperWidth: number = 0; 
    wordsWrapperOutterHeight: number = 0;

    charSpanWidth: number = 0;
    
    @ViewChild('timer') timer!: TimerComponent; 
    @ViewChild('wordsRef', {static: false}) wordsRef!: ElementRef;
    @ViewChild('caret') caret!: CaretComponent; 
    @ViewChild('wordsWrapper') wordsWrapper!: ElementRef; 
    

    ngOnInit(): void {
        this.generateWords();
        this.viewUpdate();
    }
    

    constructor () {
        afterNextRender(() => {
            this.updateValues();
        });

        afterRender(() => {
            if (this.gameEnded === false) {
                this.viewUpdate();
                this.updateCaret();
                if (this.currentLine === 3) {
                    this.onLineChange();
                }
            }
        });

    }
    

    generateWords(): void {
        for (let i = 0; i < WORD_LIST.length; i++) {
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
                if (this.EOL) return;
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
                    if (this.words[this.currentWord].isCorrect) this.totalCorrect += 2 + this.words[this.currentWord].lastChar; // account for space and 0-indexed
                    this.totalRaw += 2 + this.words[this.currentWord].lastChar;
                    this.words[this.currentWord].isActive = false;
                    this.currentWord++;
                    this.words[this.currentWord].isActive = true;
                }
                
            }
            
        }
    }

    @HostListener('document:keydown', ['$event']) backspaceEvent(e: any): void {
        if (this.allowBackspace) {
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
            this.updateValues();
            this.viewUpdate();
        }

    onTimerFinished() {
        this.started = false;
        this.gameEnded = true;
    }

   

    updateCaret(): void {
        this.caret.updatePosition(this.charLeft, this.charTop);
    }

    updateValues(): void {
        this.wordDivHeight = this.wordsRef?.nativeElement.children[this.nextRemoveIndex].offsetHeight!;

        // line offsets are usually + 40px then + 41px, etc. idk why
        this.line1Offset = this.wordsRef?.nativeElement.children[this.nextRemoveIndex].offsetTop!;
        this.line2Offset = this.line1Offset*3 + this.wordDivHeight; 
        this.line3Offset = this.line2Offset + this.wordDivHeight + this.line1Offset * 2 - 1;

        this.wordsWrapperOutterHeight = this.line3Offset + this.line1Offset + this.wordDivHeight;

        if (this.wordsWrapperOutterHeight != 122 && this.wordsWrapper) {
            let temp = this.wordsWrapper?.nativeElement as HTMLElement;
            temp.style.height = `${this.wordsWrapperOutterHeight}px`;
        }

        console.log(this.line1Offset, this.line2Offset, this.line3Offset);

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

        this.currentWordWidth = wordPOS?.offsetWidth!;
        this.charSpanWidth = charPOS?.offsetWidth!;
        this.currentWordLeftOffset = wordPOS?.offsetLeft!;

        this.wordsWrapperWidth = this.wordsRef?.nativeElement.offsetWidth!;

        this.charTop = wordPOS?.offsetTop!;
        this.charLeft = charPOS?.offsetLeft! + wordPOS?.offsetLeft!;

        if (this.words[this.currentWord].lastChar > -1) {
            this.charLeft += charPOS?.offsetWidth!;
        }  

        this.EOL = this.checkNewline();

        this.checkCurrentLine();
        this.allowBackspace = !this.gameEnded && this.currentWord >= this.nextRemoveIndex;

        if (this.currentWord === this.nextRemoveIndex && this.words[this.currentWord].lastChar === -1) {
            this.allowBackspace = false;
        }
    }

    checkNewline(): boolean {
        if (this.words[this.currentWord].equalToLength) return this.currentWordWidth + this.currentWordLeftOffset > this.wordsWrapperWidth + this.charSpanWidth;
        return false;
    }

    checkCurrentLine(): void {
        if (this.line1Offset <= this.charTop && this.charTop < this.line2Offset) {
            this.currentLine = 1;
        } else if (this.line2Offset <= this.charTop && this.charTop < this.line3Offset) {
            this.currentLine = 2;
        } else if (this.line3Offset <= this.charTop) {
            this.currentLine = 3;
        }
    }
    
    // when current line === 3, we need to scroll up    
    onLineChange(): void {
        let childs = this.wordsRef?.nativeElement.children as HTMLCollectionOf<HTMLElement>;
        let toRemove: HTMLElement[] = [];
        while (true) {
            let currentChild = childs[this.nextRemoveIndex];
            if (this.line1Offset <= currentChild.offsetTop && currentChild.offsetTop < this.line2Offset) {
                toRemove.push(currentChild);
                this.nextRemoveIndex++;
            } else {
                break;
            }
        }
    
        for (const element of toRemove) {
            element.style.display = 'none';
        }

        this.viewUpdate();
        this.updateCaret();
    }
}
