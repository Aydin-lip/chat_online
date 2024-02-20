import { useEffect } from 'react'
import { useNavigate, Outlet } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useDispatch, useSelector } from 'react-redux'
import socket from '../socket'
import Menu from './menu'
import Style from './style.module.scss'
import { setInformation } from '../redux/slices/information'
import { changeLastMessageUser, seenLastMessageUser, setUsers } from '../redux/slices/users'
import { setGroups } from '../redux/slices/groups'
import { addNewMessage } from '../redux/slices/messages'

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
      // localStorage.clear()
      // toast.error(error.message)
      // navigate('/sign-in', { replace: true })
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


    const errorHandler = err => {
      console.log(err)
    }
    socket.on('error', errorHandler)
  }, [])

  useEffect(() => {
    if (!info.id) return

    const onNewMessage = data => {
      const message = data.message
      if (!message) return

      dispatch(changeLastMessageUser({ user_id: info.id, message }))
      dispatch(addNewMessage(message))
    }

    socket.on('New_Message', onNewMessage)
    return () => {
      socket.off('New_Message', onNewMessage)
    }
  }, [info])

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