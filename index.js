function state(rows){
    return new State(rows)
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
  }

function solve(n){
    return constrain((n-1) % 4, 1, 3)
}

function encode(i){
    return i.toString(2).padStart(5,"0").split("").map(e => +e)
}

function normalize(v){
    return v / 20
}

function generateSample(){
    let input = getRandomInt(1,20+1)
    return [input, solve(input)]
}

function constrain(v,min,max){
    return Math.max(Math.min(max,v), min)
}

function formatSample(io){
    let [input, output] = io
    return {
        raw: input,
        input: [normalize(input)],
        output: { [output]: 1 }
    }
}

function bestLabel(output){
    let bestScore = -1
    let bestLabel = null 
    for(k in output){
        // console.log(`${k}:${output[k]}`)
        if((bestScore == -1) || (output[k] > bestScore)){
            bestScore = output[k]
            bestLabel = k
        }
    }
    return bestLabel
}

window.onload = function () {

    const config = {
        iterations: 1000000,
        binaryThresh: 0.5,
        hiddenLayers: [10],
        log: true,
        logPeriod: 1000,
        learningRate: 0.1,
        activation: 'sigmoid'
    };

    // create a simple feed forward neural network with backpropagation
    const net = new brain.NeuralNetwork(config);

    let trainingData = []
    for (let i = 0; i < 100; i++) {
        trainingData.push(formatSample(generateSample()))
    }

    // console.log(JSON.stringify(trainingData))

    console.log(net.train(trainingData))

    console.log('validation:')

    for (let index = 1; index <= 20; index++) {
        let prediction = net.run([normalize(index)])
        console.log(`for input ${index}, predicted ${bestLabel(prediction)}, correct was ${solve(index)}.\tDetails are ${JSON.stringify(prediction)}`)
    }
}