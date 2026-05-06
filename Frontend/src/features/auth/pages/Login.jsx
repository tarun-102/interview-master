import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router';
import '../auth.form.scss';
import { useAuth } from '../hooks/useAuth'

function Login() {


  const navigate = useNavigate();
  const { login, handleLogin, loading } = useAuth();


  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    await handleLogin({ email, password })
    navigate('/')
  }

  if (loading) {
    return (
      <main>
        <h1>Loading...</h1>
      </main>
    )
  }
  return (
    <main>
      <div className="form-container">
        <h1>Login</h1>

        <form onSubmit={handleSubmit}>

          <div className="input-group">
            <label htmlFor='email'

            >Email</label>
            <input
              onChange={(e) => setEmail(e.target.value)}
              type="email" ifd="email" name="email" placeholder='Enter email address' />
          </div>

          <div className="input-group">
            <label htmlFor='password'

            >Passwords</label>
            <input
              onChange={(e) => setPassword(e.target.value)}
              type="Password" ifd="passwprd" name="password" placeholder='Enter your passwords' />
          </div>
          <button className='button primary-button'>Login</button>
        </form>
        <p>Don't have an account?<Link to={"/register"}>Sign-up</Link> </p>
      </div>
    </main>
  )
}

export default Login