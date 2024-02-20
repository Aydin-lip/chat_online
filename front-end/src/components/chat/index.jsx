import { useEffect, useMemo, useRef, useState } from "react"
import { useLocation, useNavigation } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import ChatFooter from "./footer"
import ChatHeader from "./header"
import socket from "../../socket"
import TextMessage from "./messages/text"
import FileMessage from "./messages/file"
import VoiceMessage from "./messages/voice"
import Style from './style.module.scss'
import Profile from "../profile"
import UnRead from "./messages/unRead"
import { setMessages } from "../../redux/slices/messages"
import { editGroup } from "../../redux/slices/groups"

const Chat = () => {
  const location = useLocation()
  const dispatch = useDispatch()

  const info = useSelector(state => state.information.info)
  const messages = useSelector(state => state.messages.messages)
  const users = useSelector(state => state.users.users)
  const groups = useSelector(state => state.groups.groups)

  const chatContent = useRef()

  const { id: chatId, kind: chatKind } = useMemo(() => {
    const pathSplited = location?.pathname.split('/')
    const chat = {
      id: pathSplited.slice(-1).join(),
      kind: pathSplited.slice(-2, -1).join(),
    }
    return chat
  }, [location.pathname])

  const chatInfo = useMemo(() => ([...users, ...groups].find(chat => chat.id === chatId)), [chatId, chatKind, users, groups])

  useEffect(() => {
    const onGetMessages = data => {
      data = data.map(msg => ({ ...msg, seen: JSON.parse(msg.seen), actions: JSON.parse(msg.actions) }))

      const first = data.filter(msg => msg?.user_id == info.id || msg?.seen.includes(info.id))
      const last = data.filter(msg => msg?.user_id != info.id && !msg?.seen.includes(info.id))

      if ((last.length >= 2) && !data.find(msg => msg.type === 'unread')) {
        first.push({ type: "unread" })
      } else if ((last.length < 2) && data.find(msg => msg.type === 'unread')) {
        return dispatch(setMessages(data.filter(msg => msg.type !== 'unread')))
      }
      dispatch(setMessages([...first, ...last]))
    }
    const onGetChatInfo = data => {
      dispatch(editGroup({
        id: chatId,
        group: {
          ...chatInfo,
          members: data.members,
          online_members: data.online_members
        }
      }))
    }

    socket.emit('Select_Chat', chatId)
    socket.emit('Get_Chat_Messages', chatId)

    chatKind === 'group' &&
      socket.emit('Get_Group_Custom_Info', chatId, ['online_members'])

    socket.on('Get_Chat_Messages', onGetMessages)
    socket.on('Get_Group_Custom_Info', onGetChatInfo)
    return () => {
      socket.off('Get_Chat_Messages', onGetMessages)
      socket.off('Get_Group_Custom_Info', onGetChatInfo)
    }
  }, [chatKind, chatId])

  useEffect(() => {
    if (chatContent.current)
      chatContent.current.scrollTo({
        top: chatContent.current.scrollHeight + 200,
        left: 0,
        behavior: 'smooth'
      })
  }, [chatContent.current?.scrollHeight])

  useEffect(() => {
    const rows = document.querySelectorAll('.observ')

    const ids = []
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        const seenId = +entry.target.dataset?.seen
        if (entry.isIntersecting && !ids.includes(seenId))
          ids.push(seenId)
      })
      // socket.emit('Seen_Messages', idx, chatId)
    })

    rows?.forEach(row => {
      if (row.dataset.seen !== '0') {
        observer.observe(row)
      } else {
        observer.unobserve(row)
      }
    })

  }, [messages])

  return chatInfo?.id && (
    <>
      <div className={Style.chatScreen}>
        <ChatHeader group={chatKind === 'group'} data={chatInfo} />

        <div className={Style.content} ref={chatContent}>
          {messages?.map((message, idx) =>
            <div key={idx} className={`${message.user_id === info.id ? Style.sender : ''} ${message.type !== 'unread' ? 'observ' : ''}`} data-seen={message.seen?.includes(info.id) ? '0' : message.id}>
              {/* <div className={Style.avatar}>
                <img src="/images/avatar.png" alt="default avatar" />
              </div> */}
              {message.type === 'text' ?
                <TextMessage message={message} user={info} group={chatKind === 'group'} />
                : message.type === 'file' ?
                  <FileMessage message={message} user={info} group={chatKind === 'group'} />
                  : message.type === 'voice' ?
                    <VoiceMessage message={message} user={info} group={chatKind === 'group'} />
                    : message.type === 'unread' ?
                      <UnRead />
                      : ''
              }
            </div>
          )}
        </div>

        <ChatFooter data={chatInfo} />
      </div>
      <Profile />
    </>
  )
}

export default Chat