import { useEffect, useMemo, useRef, useState } from "react"
import { useLocation, useNavigation } from 'react-router-dom'
import ChatFooter from "./footer"
import ChatHeader from "./header"
import socket from "../../socket"
import TextMessage from "./messages/text"
import FileMessage from "./messages/file"
import VoiceMessage from "./messages/voice"
import Style from './style.module.scss'
import Profile from "../profile"

const Chat = () => {
  const [info, setInfo] = useState({})
  const [messages, setMessages] = useState([])
  const [chatInfo, setChatInfo] = useState({})

  const location = useLocation()
  const navigation = useNavigation()

  const chatContent = useRef()

  const { id: chatId, kind: chatKind } = useMemo(() => {
    const pathSplited = location?.pathname.split('/')
    const chat = {
      id: pathSplited.slice(-1).join(),
      kind: pathSplited.slice(-2, -1).join(),
    }
    return chat
  }, [location.pathname])

  useEffect(() => {
    const onGetMessages = data => {
      setMessages(data)
    }

    const onGetChatInfo = data => {
      setChatInfo(data)
    }

    socket.emit('Select_Chat', chatId)
    socket.emit('Get_Chat_Messages', chatId)

    chatKind === 'group' ?
      socket.emit('Get_Group_Custom_Info', chatId)
      :
      socket.emit('Get_User_Custom_Info', navigation.text)


    socket.on('Get_Info', data => setInfo(data))

    socket.on('Get_Chat_Messages', onGetMessages)
    socket.on('Get_Group_Custom_Info', onGetChatInfo)
    socket.on('Get_User_Custom_Info', onGetChatInfo)
    return () => {
      socket.off('Get_Chat_Messages', onGetMessages)
      socket.off('Get_Group_Custom_Info', onGetChatInfo)
      socket.off('Get_User_Custom_Info', onGetChatInfo)
    }
  }, [chatKind, chatId])

  useEffect(() => {
    if (chatContent.current)
      chatContent.current.scrollTo({
        top: chatContent.current.scrollHeight + 200,
        left: 0,
        behavior: 'smooth'
      })
  }, [chatContent.current?.scrollHeight])

  return chatInfo?.id && (
    <>
      <div className={Style.chatScreen}>
        <ChatHeader group={chatKind === 'group'} data={chatInfo} />

        <div className={Style.content} ref={chatContent}>
          {messages?.map((message, idx) =>
            <div key={idx} className={`${message.user_id === info.id ? Style.sender : ''}`}>
              {/* <div className={Style.avatar}>
                <img src="/images/avatar.png" alt="default avatar" />
              </div> */}
              {message.type === 'text' ?
                <TextMessage message={message} user={info} group={chatKind === 'group'} />
                : message.type === 'file' ?
                  <FileMessage message={message} user={info} group={chatKind === 'group'} />
                  : message.type === 'voice' ?
                    <VoiceMessage message={message} user={info} group={chatKind === 'group'} />
                    : ''
              }
            </div>
          )}
        </div>

        {/* <ChatFooter data={info} /> */}
      </div>
      <Profile />
    </>
  )
}

export default Chat