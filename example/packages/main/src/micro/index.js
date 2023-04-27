import { registerMicroApps, addGlobalUncaughtErrorHandler } from 'qiankun';
export { start } from 'qiankun'
import { base as base_ } from '../../../config'

const base = process.env.NODE_ENV === 'development' ? '' : base_
const baseUrl = base.replace('http://', '')
registerMicroApps([
    {
        name: 'vite_react',
        entry: `//${baseUrl || 'localhost:'}9526`,
        container: '#micro',
        activeRule: '/vite_react'
    },
    {
        name: 'vite_vue2',
        entry: `//${baseUrl || 'localhost:'}9527`,
        container: '#micro',
        activeRule: '/vite_vue2'
    },
    {
        name: 'vite_vue3',
        entry: `//${baseUrl || 'localhost:'}9528`,
        container: '#micro',
        activeRule: '/vite_vue3'
    }
])

addGlobalUncaughtErrorHandler(err => {
    console.error(err)
    const { message } = err
    // 加载失败时提示
    if (message && message.includes('died in status LOADING_SOURCE_CODE')) {
        console.error('微应用加载失败，请检查应用是否可运行')
    }
})