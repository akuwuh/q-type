import { createSelector } from "@ngrx/store";
import { GameState } from "./game.reducers";
import { AppState } from "../app.state";

export const selectGame = (state: AppState) => state.game;
export const selectGameStatus = createSelector(
    selectGame,
    (state: GameState) => {
        return state.status;
    }
)


export const selectGameStarted = createSelector(
    selectGame,
    (state: GameState) => {
        return state.status === 'started';
    }
)


export const selectGameEnded = createSelector(
    selectGame,
    (state: GameState) => {
        return state.status === 'ended';
        
    }
)

export const selectDurationChange = createSelector(
    selectGame,
    (state: GameState) => {
        return state.duration;
    }
)

export const selectRestart = createSelector(
    selectGame,
    (state: GameState) => {
        return state.restart;
    }
)