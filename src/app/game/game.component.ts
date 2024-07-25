import { Component, OnInit, Input} from '@angular/core';
import { Word } from '../utils/word';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [],
  templateUrl: './game.component.html',
  styleUrl: './game.component.css'
})
export class GameComponent implements OnInit {
    @Input() duration: number;
    words: Word[] = [];
    currentWord = 0;

    ngOnInit(): void {
        this.generateWords();
    }

    generateWords(): void {
        for (let i = 0; i < 2; i++) {
            this.words.push(new Word("hello", 0, 0, i));
        }
    }

    onInput(e: any): void {
        if (!e.Space) {
            const value = e?.target?.value?.trim();
            if (value.length > this.words[this.currentWord].len + 5) {
                return;
            }
            this.words[this.currentWord].input = value;
            this.words[this.currentWord].update(); 
        }
      }

    onSpace(e: any): void {
        // on space confirm word or if word is empty do nothin 
        if (this.words[this.currentWord].input === "") {
            return;
        }
        this.currentWord++;
    }

}
