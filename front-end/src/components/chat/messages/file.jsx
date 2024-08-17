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
      <div className={`${Style.file} ${message.user_id === user.id ? Style.sender : Style.reciver}`}>
        <div className={Style.file_message} onClick={getDataFileHandler}>
          <div>
            <p>{message.name}</p>
            <span className={Style.file_size}>{fileSize}</span>
          </div>
          <span>
            <img src={['png', 'jpg', 'jpeg'].includes(message.path.split('.')[message.path.split('.').length - 1]) ? message.path : '/images/download.png'} alt="download" />
          </span>
        </div>
        <div className={`${Style.time} ${message.user_id === user.id ? '' : Style.sender}`}>
          <span>{message.createdAt.split('T').join(' ').split('.').slice(0, -1).join().split(':').slice(0, -1).join(':')}</span>
          {message.user_id === user.id &&
            <span className={Style.status}>✔{message.seen?.length > 1 && '✔'}</span>
          }
        </div>
      </div>
    </>
  )
}

export default FileMessage