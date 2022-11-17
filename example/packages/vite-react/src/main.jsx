import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter,  RouterProvider } from 'react-router-dom'
import { createLifecyle, getMicroApp } from 'vite-plugin-legacy-qiankun'
import App from './App'
import './index.css'
import pkg from '../package.json'
import Home from './Home.jsx'
import About from './About.jsx'
import { base } from '../../config'

const microApp = getMicroApp(pkg.name)

const router = createBrowserRouter([
  {
    path: '/',
    element: <App></App>,
    children: [
      {
        path: '/',
        element: <Home></Home>,
      },
      {
        path: '/about',
        element: <About></About>,
      }
    ]
  },
],{ basename: microApp.__POWERED_BY_QIANKUN__ ? `/${pkg.name}` : '' })

const render = () => {
  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  )
}

if (microApp.__POWERED_BY_QIANKUN__) {
  createLifecyle(pkg.name, {
    mount(props) {
      console.log('mount', pkg.name);
      render();
    },
    bootstrap() {
      console.log('bootstrap', pkg.name);
    },
    unmount() {
      console.log('unmount', pkg.name)
    }
  })
} else {
  render();
}