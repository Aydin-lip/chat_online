import Chat from './chat'
import Menu from './menu'
import Profile from './profile'
import './style.css'

const Layout = () => {
  return (
    <>
      <div className='chat-box'>
        <Menu />
        <Chat />
        <Profile />
      </div>
    </>
  )
}

export default Layout