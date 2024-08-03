import { createReducer, on } from "@ngrx/store";
import { durationChange, endGame, resetGame, startGame, triggerRestart } from "./game.actions";
import { state } from "@angular/animations";

export interface GameState {
    status: string;
    duration: number;
    ended: boolean;
    started: boolean;
    restart: boolean;
}

export const initialGameState: GameState = {
    ended: false,
    started: false,
    duration: 15,
    status: 'pending',
    restart: false
}

export const gameReducer = createReducer(
    initialGameState, // supply inital state

    on(startGame, (state) => ({
        ...state, 
        status: 'started',
        ended: false,
        started: true,
    })),

    on(endGame, (state) => ({ // will update with wpm and stuff
        ...state, 
        status: 'ended',
        ended: true,
        started: false,
    })),

    on(resetGame, (state) => ({
        ...state, 
        ended: false,
        started: false,
        status: 'pending', // should be 'pending'
        restart: false
    })),

    on(durationChange, (state, {duration}) => ({ // want to ensure that game is in idle state, if not change to idle state
        ...state, 
        duration: duration,
        ended: false,
        started: false,
        status: 'pending', // enforce the restart
        restart: true
    })),

    on(triggerRestart, (state) => ({
        ...state, 
        restart: true
    }))
)