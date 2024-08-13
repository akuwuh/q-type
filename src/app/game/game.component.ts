import { Component, OnInit, HostListener, ViewChild, ViewChildren, QueryList, ElementRef, afterRender, afterNextRender, Input} from '@angular/core';

import { Word } from '../utils/word';
import { CharState } from '../utils/char';
import { TimerComponent } from '../timer/timer.component';
import { ResultComponent } from '../result/result.component';
import { generateShuffled } from '../utils/wordList';
import { CaretComponent } from '../caret/caret.component';
import { trigger, state, style, animate, transition, query, group } from '@angular/animations';
import { CommonModule } from '@angular/common';

// NGRX stuff
import { Store } from '@ngrx/store';
import { startGame, endGame, resetGame, triggerRestart } from '../ngrx/game/game.actions';
import { selectGameEnded, selectGameStarted, selectGameStatus, selectDurationChange} from '../ngrx/game/game.selectors';
import { AppState } from '../ngrx/app.state';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [TimerComponent, ResultComponent, CaretComponent, CommonModule],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss',
  animations: [
    trigger('fadeIn', [
		transition(':enter', [
			style({ opacity: 0 }),
			animate('500ms 100ms ease-in', style({ opacity: 1 }))
		]),
	]),

    trigger('fadeOut', [
		transition(':leave', [
			style({ opacity: 1 }),
			animate('500ms 100ms ease-out', style({ opacity: 0 }))
		]),
	]),

    trigger('fadeIn2', [
		transition(':enter', [
			style({ opacity: 0 }),
			animate('500ms 250ms ease-in', style({ opacity: 1 }))
		]),
	]),
  ]
})

export class GameComponent implements OnInit {
    @Input() wordList: string[] = []; 
    duration: number = 15;
    words: Word[] = [];
    currentWord: number = 0;
    totalCorrect: number = 0; // correct worsds
    totalRaw: number = 0;
    limbo: boolean = false;
    started: boolean = false;
    gameEnded: boolean =  false;
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
    wordDivMargin: number = 0;

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
    
    gameStateDuration$ = this.store.select(selectDurationChange);
    gameState$ = this.store.select(selectGameStatus);
    gameStartedObs$ = this.store.select(selectGameStarted);
    gameEndedObs$ = this.store.select(selectGameEnded);

    ngOnInit(): void {
        this.store.dispatch(resetGame()); // we'll see
        this.gameState$.subscribe({
            next: (status) => {
                if (status === 'ended') {
                    this.gameEnded = true;
                    this.started = false;
                } else if (status === 'started') {
                    this.started = true;
                    this.gameEnded = false;
                } else {
                    this.started = false;
                    this.gameEnded = false;
                }
            }

        });

        this.gameStateDuration$.subscribe({
            next: (status) => {
                this.duration = status;
            }
        });

        this.generateWords();
        this.viewUpdate();
        this.updateCaret();
    }
    

    constructor (private store: Store<AppState>) {
        afterNextRender(() => {
            this.viewUpdate();
            this.updateValues();
            this.updateCaret();
        });

        afterRender(() => {
            if (!this.gameEnded) {
                this.viewUpdate();
                this.updateCaret();
                console.log(this.line1Offset, this.line2Offset, this.line3Offset);
                if (this.currentLine === 3) {
                    this.onLineChange();
                }
            }
        });
 

    }
    

    generateWords(): void {
        for (let i = 0; i < this.wordList.length; i++) {
            this.words.push(new Word(this.wordList[i], 0, 0, i));
        }
        this.words[this.currentWord].isActive = true;
    }

    @HostListener('document:keypress', ['$event']) keyEvent(e: any): void {
        if (!this.gameEnded && e.key != "Tab" && e.key != "Enter") {
            // start timer on first key press
            if (!this.started && this.timer) {
                this.timer.startTimer();
                this.store.dispatch(startGame());
            }
            // alpha chars only
            if (e.key != " ")

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
        this.store.dispatch(endGame());
    }

   

    updateCaret(): void {
        this.caret.updatePosition(this.charLeft, this.charTop);
    }

    updateValues(): void {
        this.wordDivHeight = this.wordsRef?.nativeElement.children[this.nextRemoveIndex].offsetHeight!;
        let tempMarginTop = getComputedStyle(this.wordsRef?.nativeElement.children[this.nextRemoveIndex]).marginTop.slice(0, -2); 
        this.wordDivMargin = parseInt(tempMarginTop);
        
        // line offsets are usually + 36px then + 35px, etc. idk why
        this.line1Offset = this.wordsRef?.nativeElement.children[this.nextRemoveIndex].offsetTop!;

        this.line2Offset = this.line1Offset + this.wordDivHeight + this.wordDivMargin *2; 
        this.line3Offset = this.line2Offset + this.wordDivHeight + this.wordDivMargin *2 - 1; 

        this.wordsWrapperOutterHeight = this.line3Offset + this.line1Offset + this.wordDivHeight;

        // if (this.wordsWrapperOutterHeight > 117 && this.wordsWrapper) {
        //     let temp = this.wordsWrapper?.nativeElement as HTMLElement;
        //     temp.style.height = `${this.wordsWrapperOutterHeight}px`;
        // }
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

    restartGame(): void {
        this.store.dispatch(triggerRestart());
    }

    onDestroy(): void {
        this.store.dispatch(resetGame());
    }
}
