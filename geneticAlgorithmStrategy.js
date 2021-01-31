import { constrainPlayable, winrate } from './game.js'
import { getRandomInt, randIn } from './util.js'
import { randomPlay } from './randomStrategy.js'

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

function selection(population) {
    return population.slice(0, Math.floor(population.length / 3))
}

function sortPopulation(population, against) {
    let populationWithVsRandom = population.map(c => [c, winrate(playChromosome(c), against)])
    populationWithVsRandom.sort((a, b) => b[1] - a[1])
    console.log(`Best vs random winrate: ${populationWithVsRandom[0][1] * 100}`)
    return populationWithVsRandom.map(c => c[0])
}

export function playGA(){
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

    return playChromosome(populationSorted[0])
}