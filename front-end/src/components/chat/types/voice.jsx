import axios from "axios"
import { useEffect, useRef, useState } from "react"

const VoiceMessage = ({ message, user }) => {
  const [play, setPlay] = useState(false)
  const [voice, setVoice] = useState(null)

  const audioRef = useRef()
  const progressRef = useRef()
  const durationRef = useRef()

  // change text audio duration function
  const durationTextFunc = (M, S, MD, SD) =>
    durationRef.current.innerText = `${M}:${S < 10 ? '0' + S : S} / ${MD}:${SD < 10 ? '0' + SD : SD}`

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
      <div className={message.from === user.username ? 'reciver' : 'sender'}>
        <audio ref={audioRef} src={voice}></audio>
        <div className="message-voice-type">
          <div className="progress" ref={progressRef} onClick={changeProgressHandler}></div>
          <span onClick={() => {
            if (play) puseVoiceHandler()
            else if (!voice) getVoice()
            else playVoiceHandler()
          }}>
            {play ?
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25v13.5m-7.5-13.5v13.5" />
              </svg>
              :
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
              </svg>
            }
          </span>
        </div>
        <div className={`time ${message.from !== user.username ? 'time_sender' : ''}`}>
          <span className="duration" ref={durationRef}></span>
          <span>{message.time}</span>
        </div>
        {message.from !== user.username &&
          <span className="status">✔{!message.unVisit && '✔'}</span>
        }
      </div>
    </>
  )
}

export default VoiceMessage