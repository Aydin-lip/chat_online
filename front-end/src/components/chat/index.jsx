import { useEffect, useState } from "react"
import ChatFooter from "./footer"
import ChatHeader from "./header"
import './style.css'
import socket from "../../socket"

const Chat = () => {
  const [messages, setMessages] = useState([])
  const [user, setUser] = useState({})

  useEffect(() => {
    socket.on('get_user', user => {
      setUser(user)
    })
    socket.on('messages_user', data => {
      setMessages(data)
    })
  }, [])

  return user?.id && (
    <>
      <div className='chat'>
        <ChatHeader data={user} />

        <div className="content">
          {messages?.map((message, idx) =>
            <div key={idx} className={`box-message ${message.from === user.username ? 'box-message_reciver' : ''}`}>
              <div className="avatar">
                <img src="/images/avatar.png" alt="default avatar" />
              </div>
              <div className={message.from === user.username ? 'reciver' : 'sender'}>
                <p>
                  {message.text}
                </p>
                <span className="time">{message.time}</span>
              </div>
            </div>
          )}

          {/* <div className="box-message reciver">
            <div className="avatar">
              <img src="/images/avatar.png" alt="default avatar" />
            </div>
            <div className="reciver">
              <p>
                Hello Sir, How are you?
              </p>
              <span className="time">12:38 AM</span>
            </div>
          </div> */}
        </div>

        <ChatFooter data={user} />
      </div>
    </>
  )
}

export default Chat