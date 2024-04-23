export function sayHello() {
    console.log("Hello, world!");
  }


export const date_formate = (date) => {
const new_d=new Date(date)
return ("0" +new_d.getDate()).slice(-2)+" - "+("0"+(parseInt(new_d.getMonth())+1)).slice(-2)+" - "+(new_d.getFullYear())
}


export const heading = (title) => {
    return (   <span style={{ "text-align": "left", "font-size": "large"  }}><b>{title}</b> </span>    
    )
}


export const noting = (title) => {
    return (
        <h1 style={{ "text-align": "center", "color": "darkgrey", "margin-top":"10%" }}>{title}</h1>
    )
}