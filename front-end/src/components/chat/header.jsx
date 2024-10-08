import { useLayoutEffect, useState } from "react"
import { PulseLoader } from "react-spinners"
import socket from "../../socket"
import Style from './style.module.scss'

const ChatHeader = ({ group, data }) => {
  const [status, setStatus] = useState(false)
  const [typing, setTyping] = useState(false)

  useLayoutEffect(() => {
    const onStatus = active => {
      setStatus(active)
    }
    const onUserTyping = type => {
      setTyping(type)
    }

    socket.on('status', onStatus)
    socket.on('user_typing', onUserTyping)

    return () => {
      socket.off('status', onStatus)
      socket.off('user_typing', onUserTyping)
    }
  }, [])

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
      <div className={Style.header}>
        <img src="/images/avatar.png" alt="default avatar" />
        <div className={Style.information}>
          <h6>{group ? data.name : data.username}</h6>
          {/* {!typing &&
            <p className={Style.typing}>
              Typing
              <PulseLoader
                color="#a5a5a5"
                size={3}
                margin={1}
              />
            </p>
          } */}
          <p className={Style.typing}>
            {group ?
              <>
                <span>{data.members?.length}</span>
                members
              </>
              :
              !data.online ? getDate(data.last_seen) : 'online'
            }
          </p>
          {data?.online &&
            <span className={Style.status}></span>
          }
        </div>
        <div className={Style.actions}>
          <span>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
          </span>
          <span>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
            </svg>
          </span>
          <span>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
            </svg>
          </span>
        </div>
      </div>
    </>
  )
}

export default ChatHeader