import ChatFooter from "./footer"
import ChatHeader from "./header"
import './style.css'

const Chat = () => {
  return (
    <>
      <div className='chat'>
        <ChatHeader />

        <div className="content">
          <div className="box-message">
            <div className="avatar">
              <img src="/images/avatar.png" alt="default avatar" />
            </div>
            <div className="sender">
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatem recusandae nam praesentium sunt reiciendis pariatur laborum.
              </p>
              <span className="time">12:38 AM</span>
            </div>
          </div>
          <div className="box-message reciver">
            <div className="avatar">
              <img src="/images/avatar.png" alt="default avatar" />
            </div>
            <div className="reciver">
              <p>
                Hello Sir, How are you?
              </p>
              <span className="time">12:38 AM</span>
            </div>
          </div>
        </div>

        <ChatFooter />
      </div>
    </>
  )
}

export default Chat