import { random } from "mathjs"
export const calc = (k: number, m: number,x: number) => {
    const res = +(((-k*x) + m * random(-1,1)*x)+(100/(x))-100).toPrecision(3)
    return Number.isFinite(res)?res: 0
}

export const randomized = () => -30 + random(-3,3)
