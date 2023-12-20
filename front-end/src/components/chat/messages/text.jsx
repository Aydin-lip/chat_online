import Style from './style.module.scss'

const TextMessage = ({ message, user }) => {
  return (
    <>
      <div className={`${Style.text} ${message.from === user.username ? Style.reciver : Style.sender}`}>
        <div className={Style.text_message}>
          <p>{message.text}</p>
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