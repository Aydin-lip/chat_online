import { useEffect } from 'react'
import socket from '../socket'
import Chat from './chat'
import Menu from './menu'
import Profile from './profile'
import Style from './style.module.scss'

const Layout = () => {
  useEffect(() => {
    const nickname = localStorage.getItem('nickname')
    socket.connect()
    socket.emit('login', nickname)
  }, [])

  return (
    <>
      <div className={Style.chatBox}>
        <Menu />
        <Chat />
        <Profile />
      </div>
    </>
  ) 
}

export default Layout