import React, { FormEvent, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';

import { LOGIN_URL } from '../../tools/api-list';
import { addAccessTokenToHeader } from '../../tools/auth';

import './style.css';

const LoginPage = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const navigate = useNavigate();

  const onFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    axios(LOGIN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'accept': 'application/json'
      },
      data: `username=${username}&password=${password}`
    })
      .then((resp) => {
        addAccessTokenToHeader(resp.data.access_token);
        localStorage.setItem('token', resp.data.access_token);
        navigate('/main');
      })
  };

  return (
    <div>
      <div className='login'>
        <form onSubmit={onFormSubmit} className='login__form'>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className='login__form-username'
          />
          <input
            value={password}
            type='password'
            onChange={(e) => setPassword(e.target.value)}
            className='login__form-password'
          />
          <button type='submit' className='login__form-button'>Войти</button>
        </form>
      </div>
      <div className='register__link'>
        <div>Не зарегистрированы?</div>
        <Link className='register__link-button' to='/register'>Зарегистрироваться</Link>
      </div>
    </div>
  )
}

export default LoginPage;
