import { ApexOptions } from "apexcharts"
import { FC, useCallback, useEffect, useState } from "react"
import Graph from 'react-apexcharts'
import { BehaviorSubject, debounceTime, distinctUntilChanged, skipWhile } from "rxjs"
import BreakPoints from "../BreakPoints/BreakPoints"
import { calc, randomized } from "./func"
import "./index.css"
interface IChart {

}

const Chart: FC<IChart> = () => {
  const [working, setWorking] = useState(false)
  const [k, setK] = useState("0")
  const [m, setM] = useState("0")
  const [pulse, setPulse] = useState("0")
  const [time, setTime] = useState("0")
  const [l, setL] = useState("0")
  const [index, setIndex] = useState("0")
  const [lambda, setLambda] = useState(false)
  const [connections, setConnections] = useState<Array<{type: "connector" | "welding",point: number,}>>([{type: "connector", point: 1},{type: "connector", point: 2}])
  const initArr:  Array<{x: number, y: number}> = []
  const arr: Array<{x: number, y: number}> = new Array(100).fill(0).map((i, index) => {
    return {x: index+30,y: calc(+k,+m,index)}
  })

  const addArr: Array<{x: number, y: number}> = new Array(30).fill(0).map((i,index) => ({x:index, y: 0}))
  const addSecArr = new Array(30).fill(0).map((i,index) => ({x:index+arr.length+addArr.length, y: -6}))
  const addThirdArr = new Array(100).fill(0).map((i,index) => ({x:+(index+arr.length+addArr.length+addSecArr.length).toPrecision(3), y: +randomized().toPrecision(3)}))
  initArr.push(...addArr, ...arr, ...addSecArr, ...addThirdArr)
  const connectionAddition = () => {
    const newArr = connections.slice(0)
    newArr?.push({point: 0, type: "connector"})
    if (newArr) setConnections(newArr)
  }
  const [subj] = useState(() => new BehaviorSubject(connections ?? ""))
  useEffect(() => {
    subj.next(connections)
  }, [connections, subj])

  useEffect(() => {
    const sub = subj
      .pipe(
        debounceTime(500),
        skipWhile((val) => !val),
        distinctUntilChanged(),
      )
      .subscribe(setConnections)

    return () => {
      sub.unsubscribe()
    }
  }, [subj])

  const toggle = useCallback(()=> {
    setWorking(!working)},[setWorking,working])

    const state:{options: ApexOptions, series: ApexOptions['series']} = {
        options: {
          tooltip: {
            marker:{
              
            }
          },
          chart: {
            id: 'apexchart-example',

          },
          stroke:{
            width: 2
          },
          yaxis: {
            labels: {
              formatter: i => i.toPrecision()
            },
            decimalsInFloat: 3
          },
          xaxis: {
            labels: {
              show: false
            },
            axisTicks: {
              show: false
            },
            categories: initArr.map(i => `x: ${i.x}`),
          }
        },
        series: [{
          color: "rgba(39,29,102,1)",
          name: "y",
          data: working?initArr:[{x: 0, y: 0}]
        }]
      }      
      const isDesktop = window.innerWidth>600
    return (
        <div className={isDesktop?"main_flex":"main_flex_mobile"}>
            <div style={isDesktop ? {margin: " 30px 150px"}: undefined}>
              <Graph options={state.options} series={state.series} width={isDesktop?1100:"90%"} height={isDesktop?500:300} />
              <div>                
                <div className="addition" onClick={connectionAddition}/>
                <BreakPoints connections={connections} setConnections={setConnections} max={initArr.length}/>
              </div>
            </div>  
            <div className="flex">
            <div className="border">
                <text>
                  Длина волны
                </text>
                <div className="flex-radio">
                  <input checked={lambda} type="radio"  className={"radio"} onChange={() => setLambda(true)}></input>
                  <div className="radio--text">
                    1310 нм
                  </div>
                </div>
                <div className="flex-radio">
                  <input checked={!lambda} type="radio" className={"radio"} onChange={() => setLambda(false)}></input>
                  <div className="radio--text">
                    1350 нм
                  </div>
                </div>
              </div>
              <div className="border">
                <text>
                  Коэффициэнт К
                </text>
                <input value={k} className={"input"} onChange={(val) => setK(val.target.value)}></input>
              </div>

              <div className="border">
                <text>
                  Коэффициэнт М
                </text>
                <input value={m} className={"input"} onChange={(val) => setM(val.target.value)}></input>
              </div>
              <div className="border">
                <text>
                  Ширина изучения ns
                </text>
                <input value={pulse} className={"input"} onChange={(val) => setPulse(val.target.value)}></input>
              </div>
              <div className="border">
                <text>
                  Время усреднения s
                </text>
                <input value={time} className={"input"} onChange={(val) => setTime(val.target.value)}></input>
              </div>
              <div className="border">
                <text>
                  Диапазон КМ
                </text>
                <input value={l} className={"input"} onChange={(val) => setL(val.target.value)}></input>
              </div>
              <div className="border">
                <text>
                  Индекс
                </text>
                <input value={index} className={"input"} onChange={(val) => setIndex(val.target.value)}></input>
              </div>
              <button onClick={toggle} className="button">
                  Сформировать график
                </button>
            </div>
        </div>
    )
}

export default Chart