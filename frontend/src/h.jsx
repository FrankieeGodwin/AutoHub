import React,{useReducer} from "react";

function reducer(state,action){
    switch(action.type){
        case "increment":
            return {c:state.c+1};
        default:
            return state;
    }
}

export default function H() {
    const [state,dispatch] = useReducer(reducer,{c:0});
    return (
        <>
            <h1>Count : {state.c}</h1>
            <button onClick={()=> dispatch({type:"increment"})}>+</button>
        </>
    )

}