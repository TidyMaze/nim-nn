import { getRandomInt } from './util.js'

export function randomPlay(n) {
    return getRandomInt(1, Math.min(3, n) + 1)
}