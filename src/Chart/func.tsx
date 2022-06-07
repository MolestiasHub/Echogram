import { random, randomInt } from "mathjs"
export const calc = (wavelength: number, length: number, dynRange: number,x: number, noise: number, pulse: number, connections: Array<{type: "connector" | "welding",point: number,}>) => {
    const alpha = wavelength===1550?0.22:0.3
    const l = length > x? 1 : 0
    const len = length > x? 0 : dynRange
    const connector = 10
    const loss = 4
    const impulse = pulse % 2 === 0? pulse - 1 : pulse
    const sign = (i:number) => i>0?1:-1
    const noize = (noise * randomInt(-5,5) * x)
    const end = (dynRange * sign(x - length)) - ((dynRange * 1.5) * sign(x - length - (impulse / 2))) + ((sign(x - length  - (impulse / 2)) + 1) * random(-dynRange / 2, dynRange / 2)) - (40 * 2 * (sign(x - length  - (impulse / 2)) + 1))
    let connect = 0
    const res = +(((-x * alpha) * l - len)+ noize + (10/(x- (impulse/2))) + ((impulse/2) * sign(x)) - (50 * sign(x - impulse/2)) - 150 + end).toPrecision(3)
    connections.forEach(i => {
        const type = i.type==="connector"?connector:0
        connect += (type * sign(x - i.point)) - ((type + loss) * sign(x - i.point - (impulse / 2))) 
    })
    return Number.isFinite(res)?res+connect: 0
}

export const randomized = () => -30 + random(-3,3)
