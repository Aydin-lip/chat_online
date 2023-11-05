import { useEffect, useState } from "react"
import ChatFooter from "./footer"
import ChatHeader from "./header"
import './style.css'
import socket from "../../socket"
import ByteConverter from "../../utils/fileSize"

const Chat = () => {
  const [messages, setMessages] = useState([])
  const [user, setUser] = useState({})

  useEffect(() => {
    socket.on('get_user', user => {
      setUser(user)
    })
    socket.on('messages_user', data => {
      setMessages(data)
      console.log(data)
    })
  }, [])

  const convertBlob = data => {
    const blob = new Blob([data.file])
    const size = ByteConverter(blob.size)
    const url = URL.createObjectURL(blob)
    return { url, size }
  }

  const downloadFileHandler = data => {
    const { url } = convertBlob(data)
    const a = document.createElement('a')
    a.href = url
    a.download = data.name
    a.click()
    a.remove()
  }

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
                <div className={message.type === 'File' ? 'message' : ''} onClick={() => message.type === 'File' && downloadFileHandler(message)}>
                  <p>
                    {message.type === 'File' ? message.name : message.text}
                  </p>
                  {message.type === 'File' &&
                    <span>
                      <img src={['png', 'jpg', 'jpeg'].includes(message.file_type?.split("/")[1]) ? convertBlob(message).url : '/images/download.png'} alt="download" />
                    </span>
                  }
                </div>
                {message.type === 'File' &&
                  <span className="size">{convertBlob(message).size}</span>
                }
                <span className={`time ${message.from !== user.username ? 'time_sender' : ''}`}>{message.time}</span>
                {message.from !== user.username &&
                  <span className="status">✔{!message.unVisit && '✔'}</span>
                }
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