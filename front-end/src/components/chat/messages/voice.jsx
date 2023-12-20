import { BsFillPauseFill } from "react-icons/bs";
import { BsFillPlayFill } from "react-icons/bs";
import axios from "axios"
import { useEffect, useRef, useState } from "react"
import Style from './style.module.scss'

const VoiceMessage = ({ message, user }) => {
  const [play, setPlay] = useState(false)
  const [voice, setVoice] = useState(null)

  const audioRef = useRef()
  const progressRef = useRef()
  const durationRef = useRef()

  // change text audio duration function
  const durationTextFunc = (M, S, MD, SD) =>
    durationRef.current.innerText = `${M}:${S < 10 ? '0' + S : S}`
  // durationRef.current.innerText = `${M}:${S < 10 ? '0' + S : S} / ${MD}:${SD < 10 ? '0' + SD : SD}`

  // set default duration
  useEffect(() => {
    const time = message.duration
    const mDuration = time.min
    const sDuration = time.second
    durationTextFunc(0, 0, mDuration, sDuration)
  }, [])

  useEffect(() => {
    const audio = audioRef.current

    let intervalDuration
    const time = message.duration
    const mDuration = time.min
    const sDuration = time.second
    const duration = mDuration * 60 + sDuration

    const playingHandler = () => {
      intervalDuration = setInterval(() => {
        const currentTime = audio?.currentTime
        const progressWidth = (currentTime / duration) * 100
        if (progressWidth <= 95)
          progressRef.current.style.setProperty('--progress-position', `${progressWidth}%`)
        if (currentTime >= duration) {
          setPlay(false)
        }
        const m = Math.floor(currentTime / 60)
        const s = Math.floor(currentTime % 60)
        durationTextFunc(m, s, mDuration, sDuration)
      }, 100);
    }

    const pauseHandler = () =>
      clearInterval(intervalDuration)

    audio?.addEventListener('playing', playingHandler)
    audio?.addEventListener('pause', pauseHandler)
    return () => {
      clearInterval(intervalDuration)
      audio?.removeEventListener('playing', playingHandler)
      audio?.removeEventListener('pause', pauseHandler)
    }
  }, [play])

  const puseVoiceHandler = () => {
    audioRef.current?.pause()
    setPlay(p => !p)
  }

  const playVoiceHandler = () => {
    setTimeout(() => {
      audioRef.current?.play()
    }, 100);
    setPlay(p => !p)
  }

  const getVoice = () => {
    axios.get(message.path, {
      responseType: 'blob'
    })
      .then(({ data }) => {
        const url = URL.createObjectURL(data)
        setVoice(url)
        audioRef.current.src = url

        playVoiceHandler()
      })
      .catch(err => console.log(err))
  }

  const changeProgressHandler = e => {
    const audio = audioRef.current
    const time = message.duration
    const mDuration = time.min
    const sDuration = time.second
    const duration = mDuration * 60 + sDuration

    const percentClick = (e.nativeEvent.offsetX / e.target.offsetWidth) * 100   // get percent position element click
    progressRef.current.style.setProperty('--progress-position', `${percentClick}%`)    // change progress bar to click position
    const audioTime = (percentClick / 100) * duration   // get audio time from click position element
    audio.currentTime = audioTime    // change audio duration to click position time

    const m = Math.floor(audioTime / 60)
    const s = Math.floor(audioTime % 60)
    durationTextFunc(m, s, mDuration, sDuration)
  }

  return (
    <>
      <div className={`${Style.voice} ${message.from === user.username ? Style.reciver : Style.sender}`}>
        <audio ref={audioRef} src={voice}></audio>
        <div className={Style.voice_message}>
          <div>
            <div className={`${Style.progress} ${message.from === user.username ? '' : Style.reciver}`} ref={progressRef} onClick={changeProgressHandler}></div>
            <span className={Style.duration} ref={durationRef}></span>
          </div>
          <button className={message.from === user.username ? '' : Style.reciver} onClick={() => {
            if (play) puseVoiceHandler()
            else if (!voice) getVoice()
            else playVoiceHandler()
          }}>
            <span>
              {play ?
                <BsFillPauseFill />
                :
                <BsFillPlayFill />
              }
            </span>
          </button>
        </div>
        <div className={`${Style.time} ${message.from !== user.username ? Style.sender : ''}`}>
          <span>{message.time}</span>
          {message.from !== user.username &&
            <span className={Style.status}>✔{!message.unVisit && '✔'}</span>
          }
        </div>
      </div>
    </>
  )
}

export default VoiceMessage