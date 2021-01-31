import { nnConfig } from './nn.js'
import { solve } from './heuristic.js'
import { constrain } from './util.js'

console.log(nnConfig)

const STARTING_PIECES_COUNT = 20
const SAMPLE_SIZE = 100

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

function normalize(v) {
    return v / STARTING_PIECES_COUNT
}

function generateSample() {
    let input = getRandomInt(1, STARTING_PIECES_COUNT + 1)
    return [input, solve(input)]
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
    console.log(output)
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

function randomPlay(n) {
    return getRandomInt(1, Math.min(3, n) + 1)
}

function constrainPlayable(index, n) {
    return constrain(n, 1, Math.min(3, index + 1))
}

function makeChromosome() {
    var res = []
    for (let i = 0; i < 20; i++) {
        res.push(constrainPlayable(i, getRandomInt(1, 3 + 1)))
    }
    return res
}

function mutation(c) {
    var res = []
    for (let i = 0; i < 20; i++) {
        var offset = getRandomInt(0, 3) - 1
        res.push(constrainPlayable(i, c[i] + (getRandomInt(0, 100) < 5 ? offset : 0)))
    }
    return res
}

function crossover(ch1, ch2) {
    var res = []
    for (let i = 0; i < 20; i++) {
        res.push(getRandomInt(0, 100) < 10 ? ch1[i] : ch2[i])
    }
    return res
}

function makePopulation() {
    var res = []
    for (let i = 0; i < 100; i++) {
        res.push(makeChromosome())
    }
    return res
}

function randIn(arr) {
    return arr[getRandomInt(0, arr.length)]
}

function selectByTournament(population) {
    let fst = randIn(population)
    let snd = randIn(population)
    return (winrate(playChromosome(fst), playChromosome(snd)) >= 0.5) ? fst : snd
}

function playChromosome(chromosome) {
    return function (n) {
        return chromosome[n - 1]
    }
}

function winrate(fn1, fn2) {
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

function selection(population) {
    return population.slice(0, Math.floor(population.length / 3))
}

function sortPopulation(population, against) {
    let populationWithVsRandom = population.map(c => [c, winrate(playChromosome(c), against)])
    populationWithVsRandom.sort((a, b) => b[1] - a[1])
    console.log(`Best vs random winrate: ${populationWithVsRandom[0][1] * 100}`)
    return populationWithVsRandom.map(c => c[0])
}

window.onload = function () {

    // create a simple feed forward neural network with backpropagation
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

    function predictNN(n) {
        return bestLabel(net.run([normalize(n)]))
    }

    let wrNN = winrate(predictNN, randomPlay)

    console.log(`NN vs random winrate: ${wrNN * 100}%`)

    console.log("original:")
    let ch = makeChromosome()
    console.log(ch)
    let ch2 = mutation(ch)
    console.log("mutated:")
    console.log(ch2)

    let ch3 = makeChromosome()
    let ch4 = crossover(ch, ch3)
    console.log("crossover:")
    console.log(ch)
    console.log("+")
    console.log(ch3)
    console.log("=")
    console.log(ch4)

    var population = makePopulation()
    var populationSorted = sortPopulation(population, randomPlay)

    for (let idGen = 0; idGen < 100; idGen++) {
        let selectedPopulation = selection(populationSorted)

        let newPop = []
        for (let i = 0; i < 100; i++) {
            if (i < 5) {
                newPop.push(selectedPopulation[i])
            } else {
                let parent1 = selectByTournament(selectedPopulation)
                let parent2 = selectByTournament(selectedPopulation)
                let child = crossover(parent1, parent2)
                let mutatedChild = mutation(child)
                newPop.push(mutatedChild)
            }
        }
        // console.log(`new population:`)
        // console.log(newPop)
        population = newPop

        populationSorted = sortPopulation(population, randomPlay)
        console.log(`Generation ${idGen} best chromosome: ${populationSorted[0]}`)
    }
}