import { FaTrash } from "react-icons/fa";
import { GrEmoji } from "react-icons/gr";
import { HiOutlineCamera } from "react-icons/hi";
import { HiOutlineLink } from "react-icons/hi";
import { FaPaperPlane } from "react-icons/fa";
import { MdOutlineKeyboardVoice } from "react-icons/md";
import { useEffect, useMemo, useRef, useState } from "react"
import socket from "../../socket"
import httpService from "../../services/http.services";
import Style from './style.module.scss'

const ChatFooter = ({ data }) => {
  const [message, setMessage] = useState("")
  const [recording, setRecording] = useState(false)

  const fileRef = useRef()
  const recordingTime = useRef()
  const microphoneRef = useRef()
  const sendBtnRef = useRef()


  const sendMessageHandle = (type, send_data) => {
    socket.emit('typing', false)
    const newMessage = {
      type,
      to: data.username
    }
    if (type === 'Message') {
      socket.emit('send_message', {
        ...newMessage,
        text: message,
      })
      setMessage('')
    } else if (type === 'File') {
      const formData = new FormData()
      formData.append('file', send_data)

      httpService.post(`chat/send_message/file`, formData)
        .then(({ data }) => {
          socket.emit('send_message', {
            ...newMessage,
            name: data.name,
            path: data.path
          })
        })
        .catch(err => console.log(err))
    } else if (type === 'Voice') {
      const formData = new FormData()
      formData.append('voice', send_data.data)

      httpService.post(`chat/send_message/voice`, formData)
        .then(({ data }) => {
          socket.emit('send_message', {
            ...newMessage,
            path: data.path,
            duration: send_data.duration
          })
        })
        .catch(err => console.log(err))
    }
  }

  // Counting recording second
  useEffect(() => {
    let recordingTimer

    let min = 0
    let second = 0
    let h_second = 0

    if (!recording) {
      clearInterval(recordingTimer)
      return
    }

    recordingTimer = setInterval(() => {
      if (h_second === 100) {
        second += 1
        if (second === 60) {
          min += 1
          if (min === 60) {
            clearInterval(recordingTimer)
          }
          second = 0
        }
        h_second = 0
      } else
        h_second += 1

      recordingTime.current.innerText = `${min}:${second < 10 ? '0' + second : second}, ${h_second < 10 ? '0' + h_second : h_second}`
    }, 10);

    const keyDownHandler = e => {
      if ((e.keyCode === 13) && recording) {
        sendBtnRef.current.click()
      }
    }

    window.addEventListener('keydown', keyDownHandler)

    return () => {
      clearInterval(recordingTimer)
      window.removeEventListener('keydown', keyDownHandler)
    }
  }, [recording])

  // Recording voice and send
  useEffect(() => {
    const microphone = microphoneRef.current
    const sendBtn = sendBtnRef.current

    let audioStream;

    const sendVoiceHandle = event => {
      if (!audioStream) return

      audioStream?.stop()
      audioStream.ondataavailable = e => {
        if (event) {
          const stringTime = recordingTime.current.innerText?.split(',')[0]
          const sTimeSplit = stringTime.split(':')
          const objTime = { min: Number(sTimeSplit[0]), second: Number(sTimeSplit[1]) }
          sendMessageHandle('Voice', { data: e.data, duration: objTime })
        }
      }
      audioStream = null
      setRecording(false)
    }

    const voiceMessageHandle = () => {
      if (!navigator.getUserMedia) return

      if (audioStream) return sendVoiceHandle()

      setRecording(true)
      navigator.getUserMedia({ audio: true }, stream => {
        audioStream = new MediaRecorder(stream)
        audioStream.start()

        audioStream.stop = () => {
          stream.getAudioTracks().forEach(track => {
            track.stop()
          })
        }
      }, err => console.log(err))
    }

    microphone.addEventListener('click', voiceMessageHandle)
    sendBtn.addEventListener('click', sendVoiceHandle)

    return () => {
      microphone.removeEventListener('click', voiceMessageHandle)
      sendBtn.removeEventListener('click', sendVoiceHandle)
    }
  }, [])

  // Change status typing
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      socket.emit('typing', false)
    }, 3000)

    return () => {
      clearTimeout(delayDebounceFn)
    }
  }, [message])

  const submitFormHandler = e => {
    e.preventDefault()
    if (recording) {
      return
    }

    if (message?.length > 0) {
      sendMessageHandle('Message')
    }
  }

  const changeMessageHandle = e => {
    setMessage(e.target.value)
    socket.emit('typing', true)
  }

  const selectFileHandle = e => {
    if (e.target.files[0])
      sendMessageHandle('File', e.target.files[0])
    fileRef.current = ''
  }

  return (
    <>
      <form className={Style.footer} onSubmit={submitFormHandler} >
        <span className={`${Style.microphone} ${recording ? Style.active : ''}`} ref={microphoneRef}>
          {recording ?
            <FaTrash />
            :
            <MdOutlineKeyboardVoice />
          }
        </span>

        <div className={`${Style.recording} ${!recording ? Style.hidden : ''}`}>
          <span></span>
          <div ref={recordingTime}></div>
        </div>

        <input type='text' placeholder='Write Something' value={message} onChange={changeMessageHandle} disabled={recording} />
        <div className={Style.utils}>
          <label className={recording ? Style.disabled : ''} htmlFor="send-file">
            {/* <BsLink45Deg /> */}
            <HiOutlineLink />
            <input type="file" id="send-file" onChange={selectFileHandle} />
          </label>
          <label className={recording ? Style.disabled : ''} htmlFor="">
            <HiOutlineCamera />
          </label>
          <label className={recording ? Style.disabled : ''} htmlFor="">
            <GrEmoji strokeWidth={.5} />
          </label >
          <button type="submit" ref={sendBtnRef}>
            <span>
              <FaPaperPlane />
            </span>
          </button>
        </div >
      </form >
    </>
  )
}

export default ChatFooter