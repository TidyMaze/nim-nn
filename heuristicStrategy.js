import { constrain } from './util.js'
import { MIN_CAN_TAKE, MAX_CAN_TAKE } from './game.js'

const WINNING_STRAT_BLOCK_SIZE = 4

export function solve(n) {
    return constrain((n - 1) % WINNING_STRAT_BLOCK_SIZE, MIN_CAN_TAKE, MAX_CAN_TAKE)
}