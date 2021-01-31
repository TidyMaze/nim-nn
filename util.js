export function constrain(v, min, max) {
    return Math.max(Math.min(max, v), min)
}