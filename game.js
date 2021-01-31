import { constrain } from './util.js'

export const MIN_CAN_TAKE = 1
export const MAX_CAN_TAKE = 3
export const STARTING_PIECES_COUNT = 20

export function constrainPlayable(index, n) {
    return constrain(n, 1, Math.min(3, index + 1))
}

export function winrate(fn1, fn2) {
    var firstWins = 0
    var secondWins = 0
    for (let gameId = 0; gameId < 100; gameId++) {
        var firstToPlay = true
        var remaining = 20

        while (remaining > 0) {
            var took = null
            if (firstToPlay) {
                took = fn1(remaining)
            } else {
                took = fn2(remaining)
            }

            remaining -= took

            if (remaining == 0) {
                if (firstToPlay) {
                    secondWins++
                } else {
                    firstWins++
                }
            }
            firstToPlay = !firstToPlay
        }
    }

    return firstWins / (firstWins + secondWins)
}