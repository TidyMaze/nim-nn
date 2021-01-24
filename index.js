const MIN_CAN_TAKE = 1
const MAX_CAN_TAKE = 3
const WINNING_STRAT_BLOCK_SIZE = 4
const STARTING_PIECES_COUNT = 20
const SAMPLE_SIZE = 100

const config = {
    iterations: 200000,
    binaryThresh: 0.5,
    hiddenLayers: [10],
    log: true,
    logPeriod: 1000,
    learningRate: 0.1,
    activation: 'sigmoid',
    errorThresh: 0.02,
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

function solve(n) {
    return constrain((n - 1) % WINNING_STRAT_BLOCK_SIZE, MIN_CAN_TAKE, MAX_CAN_TAKE)
}

function normalize(v) {
    return v / STARTING_PIECES_COUNT
}

function generateSample() {
    let input = getRandomInt(1, STARTING_PIECES_COUNT + 1)
    return [input, solve(input)]
}

function constrain(v, min, max) {
    return Math.max(Math.min(max, v), min)
}

function formatSample(io) {
    let [input, output] = io
    return {
        raw: input,
        input: [normalize(input)],
        output: { [output]: 1 }
    }
}

function bestLabel(output) {
    let bestScore = -1
    let bestLabel = null
    for (k in output) {
        if ((bestScore == -1) || (output[k] > bestScore)) {
            bestScore = output[k]
            bestLabel = k
        }
    }
    return bestLabel
}

window.onload = function () {

    // create a simple feed forward neural network with backpropagation
    const net = new brain.NeuralNetwork(config);

    let trainingData = []
    for (let i = 0; i < SAMPLE_SIZE; i++) {
        trainingData.push(formatSample(generateSample()))
    }

    console.log(net.train(trainingData))

    for (let index = 1; index <= STARTING_PIECES_COUNT; index++) {
        let prediction = net.run([normalize(index)])
        console.log(`for input ${index}, predicted ${bestLabel(prediction)}, correct was ${solve(index)}.\tDetails are ${JSON.stringify(prediction)}`)
    }
}