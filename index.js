import { trainNN } from './neuralNetworkStrategy.js'
import { playGA } from './geneticAlgorithmStrategy.js'
import { winrate } from './game.js'
import { randomPlay } from './randomStrategy.js'

window.onload = function () {
    let predictNN = trainNN()
    let ga = playGA()

    let wrNN = winrate(predictNN, randomPlay)
    console.log(`NN vs random winrate: ${wrNN * 100}%`)

    let wrGA = winrate(ga, randomPlay)
    console.log(`GA vs random winrate: ${wrGA * 100}%`)    
}