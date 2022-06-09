import { ApexOptions } from "apexcharts"
import { FC, useCallback, useEffect, useState } from "react"
import Graph from 'react-apexcharts'
import { BehaviorSubject, debounceTime, distinctUntilChanged, skipWhile } from "rxjs"
import BreakPoints from "../BreakPoints/BreakPoints"
import { calc } from "./func"
import "./index.css"
interface IChart {

}

const Chart: FC<IChart> = () => {
  const [working, setWorking] = useState(false)
  const [m, setM] = useState("0.001")
  const [pulse, setPulse] = useState("20")
  const [time, setTime] = useState("0")
  const [l, setL] = useState("100")
  const [index, setIndex] = useState("0")
  const [lambda, setLambda] = useState(false)
  const [range, setRange] = useState("40")
  const [connections, setConnections] = useState<Array<{type: "connector" | "welding",point: number}>>([{type: "connector", point: +l}])
  const arr: Array<{x: number, y: number}> = new Array(1000).fill(0).map((i, ind) => {
    return {x: ind,y: calc(lambda?1310:1550,+l, +range, ind, +m, +pulse, connections)}
  })

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
    setTimeout(() => setWorking(!working), 500) 
  },[setWorking,working])

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
              formatter: i => i.toPrecision() + "дБ"
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
            categories: arr.map(i => `${i.x} КМ`),
          }
        },
        series: [{
          color: "rgba(39,29,102,1)",
          name: "y",
          data: working?arr:[{x: 0, y: 0}]
        }]
      }      
      const isDesktop = window.innerWidth>600
    return (
        <div className={isDesktop?"main_flex":"main_flex_mobile"}>
            <div style={isDesktop ? {margin: " 30px 150px"}: undefined}>
              <Graph options={state.options} series={state.series} width={isDesktop?1100:"90%"} height={isDesktop?500:300} />
              <div>                
                <div className="addition" onClick={connectionAddition}/>
                <BreakPoints connections={connections} setConnections={setConnections} max={+l}/>
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
                    1550 нм
                  </div>
                </div>
              </div>
              <div className="border">
                <text>
                  Параметр Шума
                </text>
                <input value={m} className={"input"} onChange={(val) => setM(val.target.value)}></input>
              </div>
              <div className="border">
                <text>
                  Длительность импульса  ns
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
                  Динамический диапазон дБ
                </text>
                <input value={range} className={"input"} onChange={(val) => setRange(val.target.value)}></input>
              </div>
              <div className="border">
                <text>
                  Длина линии
                </text>
                <input value={l} className={"input"} onChange={(val) => setL(val.target.value)}></input>
              </div>
              {/* <div className="border">
                <text>
                  Индекс
                </text>
                <input value={index} className={"input"} onChange={(val) => setIndex(val.target.value)}></input>
              </div> */}
              <button onClick={toggle} className="button">
                  Сформировать график
                </button>
            </div>
        </div>
    )
}

export default Chart