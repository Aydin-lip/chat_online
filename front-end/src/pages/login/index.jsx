import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import Style from './style.module.scss'

const Login = () => {
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('nickname')
    if (token)
      navigate('/')
  }, [navigate])

  const submitHandle = e => {
    e.preventDefault()
    const nickname = e.target[0].value
    if (nickname?.length > 0) {
      localStorage.setItem('nickname', nickname)
      navigate('/', { replace: true })
    }
  }

  return (
    <>
      <div className={Style.login}>
        <div>
          <img src="/images/logo.png" alt="chat_box-logo" />
          <h1>Chat Box</h1>
          <form onSubmit={submitHandle}>
            <input type="text" placeholder="Nick name" />
            <button type="submit">Login</button>
          </form>
        </div>
      </div>
    </>
  )
}

export default Login