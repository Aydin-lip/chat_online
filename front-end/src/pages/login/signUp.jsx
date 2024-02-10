import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { BiShowAlt } from "react-icons/bi";
import { BiHide } from "react-icons/bi";
import Style from './style.module.scss'
import httpService from "../../services/http.services";

const SignUp = () => {
  const [show, setShow] = useState(false)

  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token)
      navigate('/', { replace: true })
  }, [navigate])

  const submitHandle = e => {
    e.preventDefault()
    const { firstname, lastname, phone, username, password } = e.target

    if (phone.value.length < 11) return phone.focus()
    if (username.value.length < 4) return username.focus()
    if (password.value.length < 8) return password.focus()

    httpService.post('/Sign_Up', {
      firstname: firstname.value,
      lastname: lastname.value,
      phone: phone.value,
      username: username.value,
      password: password.value
    })
      .then(res => {
        localStorage.setItem("token", res.data.token)
        toast.success('You sing up success')
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
            <div>
              <input name="firstname" type="text" placeholder="Firstname" />
              <input name="lastname" type="text" placeholder="Lastname" />
            </div>
            <input name="phone" type="text" placeholder="Phone" />
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
            <button type="submit">Sign Up</button>
            <p>Already you have account? <Link to='/sign-in'>Sign In</Link></p>
          </form>
        </div>
      </div>
    </>
  )
}

export default SignUp