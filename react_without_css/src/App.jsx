import { useState } from 'react'
// import heroImg from './assets/hero.png'
// import reactLogo from './assets/react.svg'
// import viteLogo from './assets/vite.svg'
// import './App.css'
import AirportHeader from './AirportHeader'
import FlightBoard from './FlightBoard'

function App() {
  // return <h1>Ready to learn React</h1>
  return (
  <div>
    <AirportHeader />
    <h2>Departures</h2>
    <FlightBoard />
  </div>
  )
  
}

export default App
