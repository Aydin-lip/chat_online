const TextMessage = ({ message, user }) => {
  return (
    <>
      <div className={message.from === user.username ? 'reciver' : 'sender'}>
        <div className="message-text-type">
          <p>{message.text}</p>
        </div>
        <span className={`time ${message.from !== user.username ? 'time_sender' : ''}`}>{message.time}</span>
        {message.from !== user.username &&
          <span className="status">✔{!message.unVisit && '✔'}</span>
        }
      </div>
    </>
  )
}

export default TextMessage