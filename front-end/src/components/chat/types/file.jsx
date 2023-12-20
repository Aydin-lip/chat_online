import axios from "axios"
import ByteConverter from "../../../utils/fileSize"
import { useEffect, useState } from "react"

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
      <div className={message.from === user.username ? 'reciver' : 'sender'}>
        <div className="message-file-type" onClick={getDataFileHandler}>
          <p>{message.name}</p>
          <a href=""></a>
          <span>
            <img src={['png', 'jpg', 'jpeg'].includes(message.path.split('.')[message.path.split('.').length - 1]) ? message.path : '/images/download.png'} alt="download" />
          </span>
        </div>
        <span className="size">{fileSize}</span>
        <span className={`time ${message.from !== user.username ? 'time_sender' : ''}`}>{message.time}</span>
        {message.from !== user.username &&
          <span className="status">✔{!message.unVisit && '✔'}</span>
        }
      </div>
    </>
  )
}

export default FileMessage