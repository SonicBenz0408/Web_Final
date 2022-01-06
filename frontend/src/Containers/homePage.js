import { useState, useRef } from "react"
import styled from "styled-components"
import { BrowserRouter, NavLink, Switch, Route } from "react-router-dom"

const Home = ({ nowUser }) => {

    return (
        !nowUser ? 
        <h1><NavLink to="/login">LOGIN</NavLink></h1> :
        <h1><NavLink to="/login">LOGIN COMPLETE</NavLink></h1>
    )
}

export default Home