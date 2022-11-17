import React, { useState } from 'react'
import { Outlet, Link  } from 'react-router-dom'
import './App.css'


function App() {
  const [microName, setMicroName] = useState('vite_react')
  window.microName = 'vite_react'
  const outPut = (e) => {
    setMicroName(window.microName = e.target.value)
  }

  return (
    <div className="container">
      <h1>Vite + React</h1>
      <h3>
        设置全局变量：microName：
        <input type="text" value={microName} placeholder='设置全局变量：microName' onInput={outPut} />
      </h3>
      <button onClick={() => console.log('全局变量：microName', window.microName)}>打印全局变量：microName</button>

      <div>
        <Link to={"/"}>Go to Home</Link>
        <Link style={{marginLeft: '20px'}} to={"/about"}>Go to About</Link>
      </div>

      <Outlet></Outlet>
    </div>
  )
}

export default App
