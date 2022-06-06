import { FC } from "react";

interface IBreak {
    connections: Array<{type: "connector" | "welding",point: number}> | undefined
    setConnections: React.Dispatch<Array<{type: "connector" | "welding",point: number}>>
    max: number
}

const BreakPoints: FC<IBreak> = (props) => {
    const isDesktop = window.innerWidth>600
    return <div className="tableflex">
        {props.connections?.map((i,index) => {
            const newArr = props.connections?.slice(0)
            const setter = (set: {type: "connector" | "welding",point: number}) => {
                newArr?.fill(set,index,index + 1)
                if (newArr) props.setConnections(newArr)
                }
            const deleter = () => {
                newArr?.splice(index, 1)
                if (newArr) props.setConnections(newArr)
            }
            return i?<div style={{width: isDesktop? undefined : "90%"}}>
            <div style={{justifyContent: "flex-end", width: "410px", textAlign:"end"}} className="scrollflex">    
                <div style={{width: "30px", margin: 0, marginBottom:-10}}>{i.point}</div>

            </div>    
            <div className="scrollflex">
                <div style={{display: "flex", flexDirection: "column"}}>
                    <div style={{display: "flex"}}>
                        <input checked={i.type==="welding"} onClick={() => setter({type: "welding", point: i.point})} title="" type="radio"></input>
                        <div style={{textAlign:"center"}}>
                            Сварка
                        </div>
                    </div>
                    <div style={{display: "flex"}}>
                        <input onClick={() => setter({type: "connector", point: i.point})} checked={i.type==="connector"} title="" type="radio"></input>
                        <div style={{textAlign:"center"}}>
                            Коннектор
                        </div>
                    </div>
                </div>
                <input style={{width: "300px", marginLeft: 20}} type="range" min={0} max={props.max}  value={props.connections?.at(index)?.point} step={1} onChange={change => {
                    setter({type: i.type, point: change.target.valueAsNumber})
                }}/>
                <div className={"delet"} style={{marginTop: 10}} onClick={deleter}></div>
            </div>
        </div>:null})}
    </div>
}

export default BreakPoints