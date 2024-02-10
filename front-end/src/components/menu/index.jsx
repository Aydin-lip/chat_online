import { useEffect, useState } from 'react'

import socket from '../../socket'
import Style from './style.module.scss'

const Menu = () => {
  const [info, setInfo] = useState({})
  const [users, setUsers] = useState([])
  const [selectUser, setSelectUser] = useState('')

  useEffect(() => {
    socket.on('Get_Info', data => setInfo(data))
    socket.on('users', users => {
      setUsers(users)
    })
  }, [info, users])

  const selectUserHandle = user => {
    setSelectUser(user.id)
    socket.emit('select_chat', user)
  }

  return (
    <>
      <div className={Style.menu}>
        <div className={Style.profile}>
          <img src="/images/avatar.png" alt="default avatar" />
          <div className={Style.information}>
            <span>{info.firstname} {info.lastname}</span>
            <span>Front end Developer</span>
          </div>
          <div className={Style.icon}>
            <span>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
              </svg>
            </span>
          </div>
        </div>
        <div className={Style.search}>
          <span>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
          </span>
          <input type="text" placeholder="Search Friends" />
        </div>
        <h5 className={Style.subtitle}>Users</h5>
        <div className={Style.usersBox}>
          {users?.map(user =>
            <div
              key={user.id}
              className={selectUser === user.id ? Style.active : ''}
              onClick={e => selectUserHandle(user)}>
              <div className={Style.avatar}>
                <img src="/images/avatar.png" alt="default avatar" />
                {user.online &&
                  <div></div>
                }
              </div>
              <div className={Style.specification}>
                <span>{user.username}</span>
                <span>{user.last_message?.text ?? user.last_message?.name}</span>
              </div>
              <div className={Style.detail}>
                <span className={Style.date}>{user.last_message?.time}</span>
                {/* {user.last_message?.from === username &&
                  <span className={Style.status}>✔{!user.last_message?.unVisit && '✔'}</span>
                } */}
                {user.unVisit_count > 0 &&
                  <span className={Style.unSeen}>{user.unVisit_count}</span>
                }
              </div>
            </div>
          )}
        </div>
        <h5 className={Style.subtitle}>Groups</h5>
      </div>
    </>
  )
}

export default Menu