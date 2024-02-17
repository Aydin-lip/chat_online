import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useNavigation, useLocation, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

import socket from '../../socket'
import Style from './style.module.scss'

const Menu = () => {
  const info = useSelector(state => state.information.info)
  const users = useSelector(state => state.users.users)
  const groups = useSelector(state => state.groups.groups)

  const navigation = useNavigation()
  const location = useLocation()
  const navigate = useNavigate()

  const chatId = useMemo(() => location?.pathname.split('/').slice(-1).join(), [location.pathname])

  const selectChatHandler = (chat, group) => {
    navigation.text = chat?.user_id
    navigate(`/${group ? 'group' : 'user'}/${chat.id}`)
  }

  const getDate = (date) => {
    if (!date) return

    let stringDate = new Date(date).toString()
    let splitDate = stringDate.split(' ')
    let month = `${splitDate[1]} ${splitDate[2]} `
    let splitClock = date.split('T')[1].split(':')
    let clock = `${splitClock[0]}:${splitClock[1]}`

    return month + clock
  }

  return (
    <>
      <div className={Style.menu}>
        <div className={Style.profile}>
          <img src={info.avatar?.length > 0 ? info?.avatar?.[0] : "/images/avatar.png"} alt="default avatar" />
          <div className={Style.information}>
            <span>{info.username}</span>
            <span>{info.firstname} {info.lastname}</span>
            {/* <span>{info.bio}</span> */}
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
              className={chatId == user.id ? Style.active : ''}
              onClick={e => selectChatHandler(user)}>
              <div className={Style.avatar}>
                <img src={user.avatar?.length > 0 ? user?.avatar?.[0] : "/images/avatar.png"} alt="default avatar" />
                {user.online &&
                  <div></div>
                }
              </div>
              <div className={Style.specification}>
                <span>{user.firstname ?? user.username} {user.lastname}</span>
                <span>{user.lastMessage?.text}</span>
              </div>
              <div className={Style.detail}>
                <span className={Style.date}>{getDate(user.lastMessage?.createdAt)}</span>
                {user.lastMessage?.user_id === info.id &&
                  <span className={Style.status}>✔{JSON.parse(user.lastMessage?.seen ?? "[]").length > 0 && '✔'}</span>
                }
                {user.notSeenMessages > 0 &&
                  <span className={Style.unSeen}>{user.notSeenMessages}</span>
                }
              </div>
            </div>
          )}
        </div>
        <h5 className={Style.subtitle}>Groups</h5>
        <div className={Style.usersBox}>
          {groups?.map(group =>
            <div
              key={group.id}
              className={chatId == group.id ? Style.active : ''}
              onClick={e => selectChatHandler(group, true)}>
              <div className={Style.avatar}>
                <img src={group.avatar?.length > 0 ? group?.avatar?.[0] : "/images/group_prof.jpg"} alt="default avatar" />
                {/* {group.online &&
                  <div></div>
                } */}
              </div>
              <div className={Style.specification}>
                <span>{group.name}</span>
                <span>{group.lastMessage?.user?.firstname}: {group.lastMessage?.text}</span>
              </div>
              <div className={Style.detail}>
                <span className={Style.date}>{getDate(group.lastMessage?.createdAt)}</span>
                {group.lastMessage?.user_id === info.id &&
                  <span className={Style.status}>✔{JSON.parse(group.lastMessage?.seen ?? "[]").length > 0 && '✔'}</span>
                }
                {group.notSeenMessages > 0 &&
                  <span className={Style.unSeen}>{group.notSeenMessages}</span>
                }
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default Menu