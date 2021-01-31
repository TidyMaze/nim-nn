export function constrain(v, min, max) {
    return Math.max(Math.min(max, v), min)
}

export function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

export function randIn(arr) {
    return arr[getRandomInt(0, arr.length)]
}