import Style from './style.module.scss'

const TextMessage = ({ message, user }) => {
  return (
    <>
      <div className={`${Style.text} ${message.user_id === user.id ? Style.sender : Style.reciver}`}>
        <div className={Style.text_message}>
          <p>{message.text}</p>
        </div>
        <div className={`${Style.time} ${message.user_id !== user.id ? Style.sender : ''}`}>
          <span>{message.createdAt.split('T').join(' ').split('.').slice(0, -1).join().split(':').slice(0, -1).join(':')}</span>
          {message.user_id === user.id &&
            <span className={Style.status}>✔{message.seen?.length > 1 && '✔'}</span>
          }
        </div>
      </div>
    </>
  )
}

export default TextMessage