import { trainNN } from './neuralNetworkStrategy.js'
import { playGA } from './geneticAlgorithmStrategy.js'
import { winrate } from './game.js'
import { randomPlay } from './randomStrategy.js'

window.onload = function () {
    let predictNN = trainNN()
    let wrNN = winrate(predictNN, randomPlay)
    console.log(`NN vs random winrate: ${wrNN * 100}%`)

    playGA()
}