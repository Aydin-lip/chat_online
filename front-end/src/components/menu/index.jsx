import { useEffect, useState } from 'react'

import socket from '../../socket'
import './style.css'


const Menu = () => {
  const [username, setUsername] = useState('')
  const [users, setUsers] = useState([])
  const [selectUser, setSelectUser] = useState('')

  useEffect(() => {
    socket.on('nick_name', value => setUsername(value))
    socket.on('users', users => {
      setUsers(users)
    })
  }, [username, users])

  const selectUserHandle = user => {
    setSelectUser(user.id)
    socket.emit('select_chat', user)
  }

  return (
    <>
      <div className="menu">
        <div className="profile">
          <img src="/images/avatar.png" alt="default avatar" />
          <div className="title">
            <span className="name main">{username}</span>
            <span className="bio">Front end Developer</span>
          </div>
          <div className="edit">
            <span>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
              </svg>
            </span>
          </div>
        </div>
        <div className="search">
          <span>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
          </span>
          <input type="text" placeholder="Search Friends" />
        </div>
        <h5 className='subtitle'>Users</h5>
        <div className="user-box">
          {users?.map(user =>
            user.username !== username &&
            <div
              key={user.id}
              className={`user ${selectUser === user.id ? 'active_user' : ''}`}
              onClick={e => selectUserHandle(user)}>
              <div className="avatar">
                <img src="/images/avatar.png" alt="default avatar" />
                {user.online &&
                  <div className='status'></div>
                }
              </div>
              <div className="title">
                <span className="name">{user.username}</span>
                <span className="bio">{user.last_message?.text ?? user.last_message?.name}</span>
              </div>
              <div>
                <span className="time">{user.last_message?.time}</span>
                {user.last_message?.from === username &&
                  <span className="tick_status">✔{!user.last_message?.unVisit && '✔'}</span>
                }
                {user.unVisit_count > 0 &&
                  <span className="badge">{user.unVisit_count}</span>
                }
              </div>
            </div>
          )}
        </div>
        <h5 className='subtitle'>Groups</h5>
      </div>
    </>
  )
}

export default Menu