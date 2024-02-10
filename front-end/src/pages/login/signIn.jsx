import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { BiShowAlt } from "react-icons/bi";
import { BiHide } from "react-icons/bi";
import Style from './style.module.scss'
import httpService from "../../services/http.services";

const SignIn = () => {
  const [show, setShow] = useState(false)

  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token)
      navigate('/', { replace: true })
  }, [navigate])

  const submitHandle = e => {
    e.preventDefault()
    const { username, password } = e.target

    if (username.value.length < 4) return username.focus()
    if (password.value.length < 8) return password.focus()

    httpService.post('/Sign_In', {
      username: username.value,
      password: password.value
    })
      .then(res => {
        localStorage.setItem("token", res.data.token)
        toast.success('You sing in success')
        window.location.pathname = '/'
        // navigate('/', { replace: true })
      })
      .catch(err => {
        toast.error(err.response.data.error)
        console.log(err.response.data)
      })
  }

  return (
    <>
      <div className={Style.login}>
        <div>
          <img src="/images/logo.png" alt="chat_box-logo" />
          <h1>Chat Box</h1>
          <form onSubmit={submitHandle}>
            <input name="username" type="text" placeholder="Username" />
            <div className={Style.password}>
              <input name="password" type={show ? "text" : "password"} placeholder="password" />
              <span onClick={() => setShow(p => !p)}>
                {show ?
                  <BiShowAlt />
                  :
                  <BiHide />
                }
              </span>
            </div>
            <button type="submit">Sign In</button>
            <p>You don't have account? <Link to='/sign-up'>Sign up</Link></p>
          </form>
        </div>
      </div>
    </>
  )
}

export default SignIn