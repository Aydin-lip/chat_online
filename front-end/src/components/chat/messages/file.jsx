import axios from "axios"
import ByteConverter from "../../../utils/fileSize"
import { useEffect, useState } from "react"
import Style from './style.module.scss'

const FileMessage = ({ message, user }) => {
  const [fileSize, setFileSize] = useState()

  let urlData;

  useEffect(() => {
    axios.get(message.path)
      .then(res =>
        setFileSize(ByteConverter(res.headers["content-length"]))
      )
      .catch(err => console.log(err))
  }, [])

  const downloadFileHandler = (url) => {
    const link = document.createElement('a')
    link.href = url
    link.download = message.name
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const getDataFileHandler = () => {
    if (!urlData)
      axios.get(message.path, {
        responseType: 'blob'
      })
        .then(({ data }) => {
          const url = URL.createObjectURL(data)
          urlData = url
          downloadFileHandler(url)
        })
        .catch(err => console.log(err))
    else
      downloadFileHandler(urlData)
  }

  return (
    <>
      <div className={`${Style.file} ${message.from === user.username ? Style.reciver : Style.sender}`}>
        <div className={Style.file_message} onClick={getDataFileHandler}>
          <div>
            <p>{message.name}</p>
            <span className={Style.file_size}>{fileSize}</span>
          </div>
          <span>
            <img src={['png', 'jpg', 'jpeg'].includes(message.path.split('.')[message.path.split('.').length - 1]) ? message.path : '/images/download.png'} alt="download" />
          </span>
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

export default FileMessage