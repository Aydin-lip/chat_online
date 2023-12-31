import { useEffect, useRef } from 'react'
import Style from './style.module.scss'

const TextMessage = ({ message, user }) => {
  const textContainer = useRef(null)

  useEffect(() => {
    if (textContainer.current)
      textContainer.current.innerText = message.text
  }, [textContainer])

  return (
    <>
      <div className={`${Style.text} ${message.from === user.username ? Style.reciver : Style.sender}`}>
        <div className={Style.text_message}>
          <p ref={textContainer}></p>
        </div>
        <div className={`${Style.time} ${message.from !== user.username ? Style.sender : ''}`}>
          <span>{message.time}</span>
          {message.from !== user.username &&
            <span className={Style.status}>✔{!message.unVisit && '✔'}</span>
          }
        </div>
      </div>
    </>
  )
}

export default TextMessage