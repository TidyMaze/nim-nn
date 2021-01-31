import { getRandomInt } from './util.js'
import { STARTING_PIECES_COUNT } from './game.js'
import { solve } from './heuristicStrategy.js'

const nnConfig = {
    iterations: 100000,
    binaryThresh: 0.5,
    hiddenLayers: [10],
    log: true,
    logPeriod: 1000,
    learningRate: 0.1,
    activation: 'sigmoid',
    errorThresh: 0.01,
}

const SAMPLE_SIZE = 100

function formatSample(io) {
    let [input, output] = io
    return {
        raw: input,
        input: [normalize(input)],
        output: { [output]: 1 }
    }
}

function normalize(v) {
    return v / STARTING_PIECES_COUNT
}

function generateSample() {
    let input = getRandomInt(1, STARTING_PIECES_COUNT + 1)
    return [input, solve(input)]
}

export function trainNN(){
    const net = new brain.NeuralNetwork(nnConfig);

    let trainingData = []
    for (let i = 0; i < SAMPLE_SIZE; i++) {
        trainingData.push(formatSample(generateSample()))
    }

    console.log(net.train(trainingData))

    for (let index = 1; index <= STARTING_PIECES_COUNT; index++) {
        let prediction = net.run([normalize(index)])
        console.log(`for input ${index}, predicted ${bestLabel(prediction)}, correct was ${solve(index)}.\tDetails are ${JSON.stringify(prediction)}`)
    }

    return function predictNN(n) {
        return bestLabel(net.run([normalize(n)]))
    }
}

function bestLabel(output) {
    let bestScore = -1
    let bestLabel = null
    for (const key in output) {
        if ((bestScore == -1) || (output[key] > bestScore)) {
            bestScore = output[key]
            bestLabel = key
        }
    }
    return bestLabel
}