import { useEffect } from 'react'
import { useNavigate, Outlet } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useDispatch, useSelector } from 'react-redux'
import socket from '../socket'
import Menu from './menu'
import Style from './style.module.scss'
import { setInformation } from '../redux/slices/information'
import { seenLastMessageUser, setUsers } from '../redux/slices/users'
import { setGroups } from '../redux/slices/groups'

const Layout = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const info = useSelector(state => state.information.info)

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
    const onInformation = data => {
      dispatch(setInformation(data))
    }
    const onGetChats = data => {
      dispatch(setUsers(data))
    }
    const onGetGroups = data => {
      dispatch(setGroups(data))
    }
    const onSeenMessages = data => {
      // dispatch(seenLastMessageUser(data.seen_messages_id))
    }

    socket.on('connect', onConnect)
    socket.on('disconnect', onDisconnect)
    socket.on('connect_error', onConnectError)

    socket.on('Get_Info', onInformation)
    socket.on('Get_Chats', onGetChats)
    socket.on('Get_Groups', onGetGroups)
    socket.on('Seen_Messages', onSeenMessages)
    return () => {
      socket.off('connect', onConnect)
      socket.off('disconnect', onDisconnect)
      socket.off('connect_error', onConnectError)

      socket.off('Get_Info', onInformation)
      socket.off('Get_Chats', onGetChats)
      socket.off('Get_Groups', onGetGroups)
    }
  }, [])

  return info.id && (
    <>
      <div className={Style.chatBox}>
        <Menu />
        <Outlet />
      </div>
    </>
  )
}

export default Layout