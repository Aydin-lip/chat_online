import { useEffect, useRef } from 'react'
import Style from './style.module.scss'


const UnRead = () => {
  const unreadRef = useRef(null)

  useEffect(() => {
    if (unreadRef.current)
      unreadRef.current.scrollIntoView({ behavior: "smooth" })
  }, [unreadRef.current])

  return (
    <>
      <div className={Style.unread_el}>
        <div ref={unreadRef}></div>
        <div>Unread messages</div>
      </div>
    </>
  )
}

export default UnRead