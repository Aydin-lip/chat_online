import { useEffect, useState } from "react"
import ChatFooter from "./footer"
import ChatHeader from "./header"
import socket from "../../socket"
import TextMessage from "./messages/text"
import FileMessage from "./messages/file"
import VoiceMessage from "./messages/voice"
import Style from './style.module.scss'

const Chat = () => {
  const [messages, setMessages] = useState([])
  const [user, setUser] = useState({})

  useEffect(() => {
    const getMessagesHandler = data => {
      setMessages(data)
    }
    const getInfoHandler = user => {
      setUser(user)
    }

    socket.on('get_user', getInfoHandler)
    socket.on('messages_user', getMessagesHandler)

    return () => {
      socket.off('get_user', getInfoHandler)
      socket.off('messages_user', getMessagesHandler)
    }
  }, [])

  return user?.id && (
    <>
      <div className={Style.chatScreen}>
        <ChatHeader data={user} />

        <div className={Style.content}>
          {messages?.map((message, idx) =>
            <div key={idx} className={`${message.from !== user.username ? Style.sender : ''}`}>
              {/* <div className={Style.avatar}>
                <img src="/images/avatar.png" alt="default avatar" />
              </div> */}
              {message.type === 'Message' ?
                <TextMessage message={message} user={user} />
                : message.type === 'File' ?
                  <FileMessage message={message} user={user} />
                  : message.type === 'Voice' ?
                    <VoiceMessage message={message} user={user} />
                    : ''
              }
            </div>
          )}
        </div>

        <ChatFooter data={user} />
      </div>
    </>
  )
}

export default Chat