import VTools from "./VTools"
import { BrowserRouter } from "react-router-dom"
import { useEffect } from "react"

function App() {
    useEffect(() => {
        document.title = "⭐夸黑退散⭐"
    }, [])
    return (
        <BrowserRouter>
            <VTools />        
        </BrowserRouter>
    )
}

export default App
