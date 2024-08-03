import { createAction, props} from '@ngrx/store';

export const startGame = createAction(
    '[Game] Start Game'
)

export const resetGame = createAction(
    '[Game] Restart Game'
) 

export const endGame = createAction(
    '[Game] End Game'
)


export const durationChange = createAction( 
    '[App] Duration Change', 
    props<{duration: number}>() // duration = 15 seconds
)


export const triggerRestart = createAction( 
    '[Game] Restart'
)

