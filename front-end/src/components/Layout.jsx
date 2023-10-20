import { useEffect, useState } from 'react'
import socket from '../socket'
import Chat from './chat'
import Menu from './menu'
import Profile from './profile'
import './style.css'

const Layout = () => {
  // const [selectUser, setSelectUser] = useState({})

  useEffect(() => {
    const nickname = localStorage.getItem('nickname')
    socket.connect()
    socket.emit('login', nickname)
  }, [])

  return (
    <>
      <div className='chat-box'>
        <Menu />
        <Chat />
        <Profile />
      </div>
    </>
  )
}

export default Layout