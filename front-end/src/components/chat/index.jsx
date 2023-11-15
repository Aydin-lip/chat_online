import { useEffect, useState } from "react"
import ChatFooter from "./footer"
import ChatHeader from "./header"
import './style.css'
import socket from "../../socket"
import ByteConverter from "../../utils/fileSize"

const Chat = () => {
  const [messages, setMessages] = useState([])
  const [user, setUser] = useState({})
  const [play, setPlay] = useState(false)

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

  const getVoice = (voice, playV) => {
    const audio = document.createElement('audio')
    const blob = new Blob([voice])
    audio.src = URL.createObjectURL(blob)
    // console.log(audio.duration)
    audio.play()
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
                <div className={message.type === 'File' ? 'message' : 'voice'} onClick={() => message.type === 'File' && downloadFileHandler(message)}>
                  {message.type === 'Voice' ? <div className="progress"></div>
                    :
                    <p>
                      {message.type === 'File' ? message.name
                        : message.type === 'Message' ? message.text
                          : ''}
                    </p>
                  }
                  {message.type === 'File' &&
                    <span>
                      <img src={['png', 'jpg', 'jpeg'].includes(message.file_type?.split("/")[1]) ? convertBlob(message).url : '/images/download.png'} alt="download" />
                    </span>
                  }
                  {message.type === 'Voice' &&
                    <span onClick={() => {
                      setPlay(p => !p)
                      getVoice(message.voice, !play)
                    }}>
                      {play ?
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25v13.5m-7.5-13.5v13.5" />
                        </svg>
                        :
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
                        </svg>
                      }
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