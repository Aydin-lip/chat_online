import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import socket from '../socket'
import Chat from './chat'
import Menu from './menu'
import Profile from './profile'
import Style from './style.module.scss'

const Layout = () => {
  const navigate = useNavigate()

  useEffect(() => {
    socket.connect()

    const onConnect = () => {
      console.log('connect')
      toast.success('Connected')
    }
    const onDisconnect = () => {
      console.log('disconnect')
      toast.info('Disconnected')
    }
    const onConnectError = error => {
      localStorage.clear()
      toast.error(error.message)
      navigate('/sign-in', { replace: true })
    }

    socket.on('connect', onConnect)
    socket.on('disconnect', onDisconnect)
    socket.on('connect_error', onConnectError)
    return () => {
      socket.off('connect', onConnect)
      socket.off('disconnect', onDisconnect)
      socket.off('connect_error', onConnectError)
    }
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