import { FaTrash } from "react-icons/fa";
import { GrEmoji } from "react-icons/gr";
import { HiOutlineCamera } from "react-icons/hi";
import { HiOutlineLink } from "react-icons/hi";
import { FaPaperPlane } from "react-icons/fa";
import { MdOutlineKeyboardVoice } from "react-icons/md";
import { useEffect, useMemo, useRef, useState } from "react"
import socket from "../../socket"

const ChatFooter = ({ data }) => {
  const [message, setMessage] = useState("")
  const [recording, setRecording] = useState(false)

  const fileRef = useRef()
  const recordingTime = useRef()

  const sendMessageHandle = (type, send_data) => {
    socket.emit('typing', false)
    const newMessage = {
      type,
      to: data.username
    }
    if (type === 'Message') {
      socket.emit('send_message', {
        ...newMessage,
        message: message,
      })
      setMessage('')
    } else if (type === 'File') {
      socket.emit('send_message', {
        ...newMessage,
        name: send_data.name,
        file: send_data.file,
        file_type: send_data.file.type
      })
    } else if (type === 'Voice') {
      socket.emit('send_message', {
        ...newMessage,
        voice: send_data,
      })
    }
  }

  // Counting recording second
  useEffect(() => {
    let recordingTimer

    if (!recording) {
      clearInterval(recordingTimer)
      return
    }

    let min = 0
    let second = 0
    let h_second = 0

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

    return () => {
      clearInterval(recordingTimer)
    }
  }, [recording])

  // Recording voice and send
  useEffect(() => {
    const microphone = document.querySelector('.microphone')
    const sendBtn = document.querySelector('.send-btn')

    let audioStream;

    const sendVoiceHandle = event => {
      if (!audioStream) return

      audioStream?.stop()
      audioStream.ondataavailable = e => {
        if (event) {
          // socket.emit('voice_message', e.data)
          sendMessageHandle('Voice', e.data)
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
      microphone.addEventListener('click', voiceMessageHandle)
      sendBtn.addEventListener('click', sendVoiceHandle)
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
    const file = e.target.files[0]
    sendMessageHandle('File', { name: file.name, file })
    fileRef.current = ''
  }

  return (
    <>
      <form className='footer' onSubmit={submitFormHandler} >
        <span className={`microphone ${recording ? 'active-mic' : ''}`} >
          {recording ?
            <FaTrash />
            :
            <MdOutlineKeyboardVoice />
          }
        </span>
        {recording &&
          <div className="recording">
            <span></span>
            <div ref={recordingTime}></div>
          </div>
        }
        <input type='text' placeholder='Write Something' value={message} onChange={changeMessageHandle} disabled={recording} />
        <div className='utils'>
          <label className={recording ? 'disabled' : ''} htmlFor="send-file">
            {/* <BsLink45Deg /> */}
            <HiOutlineLink />
            <input type="file" id="send-file" onChange={selectFileHandle} />
          </label>
          <label className={recording ? 'disabled' : ''} htmlFor="">
            <HiOutlineCamera />
          </label>
          <label className={recording ? 'disabled' : ''} htmlFor="">
            <GrEmoji strokeWidth={.5} />
          </label >
          <button type="submit" className="send-btn">
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