import { Component, OnInit, HostListener, ViewChild, ViewChildren, QueryList, ElementRef} from '@angular/core';
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
    // wordsDOM: HTMLCollectionOf<Element> | undefined;

    @ViewChild('timer') timer!: TimerComponent; 
    // @ViewChild('words') el:ElementRef;

    ngOnInit(): void {
        this.generateWords();
        // this.wordsDOM = document.getElementById('words')!.children;
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

            // this.getCurrentWord();
        }
    }

    @HostListener('document:keydown', ['$event']) backspaceEvent(e: any): void {
        if (!this.gameEnded) {
            if (e.keyCode === 8) { // is backspace
                if (this.words[this.currentWord].lastChar === -1 && this.currentWord > 0 && this.words[this.currentWord - 1].isCorrect === false) {
                    
                    this.words[this.currentWord].isActive = false;
                    this.currentWord--;
                    this.words[this.currentWord].isActive = true;
                    // this.getCurrentWord();

                } else {
                    this.words[this.currentWord].removeChar();
                }
            }
            this.words[this.currentWord].update();
        }
    }

    onTimerFinished() {
        this.started = false;
        this.gameEnded = true;
    }

    // getCurrentWord(): void {
    //     console.log(this.wordsDOM!.item(this.currentWord));
    // }

}
