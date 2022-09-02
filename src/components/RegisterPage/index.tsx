import React, { ChangeEvent, FormEvent, useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router';
import axios from 'axios';

import { REGISTER_URL } from '../../tools/api-list';

import './style.css';

const RegisterPage = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const navigate = useNavigate();

  const onUsernameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  }

  const onPasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  }

  const onFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    axios(REGISTER_URL, {
      method: 'POST',
      params: { username, password }
    })
      .then(() => {
        navigate('/login');
      })
      .catch(console.error);
  };

  return (
    <div>
      <div className='register'>
        <form onSubmit={onFormSubmit} className='register__form'>
          <input className='register__form-username' value={username} onChange={onUsernameChange} />
          <input className='register__form-password' type='password' value={password} onChange={onPasswordChange} />
          <button className='register__form-button' type='submit'>Зарегистрироваться</button>
        </form>
      </div>
      <div className='register__link'>
        <div>Зарегистрированы?</div>
        <Link className='register__link-button' to='/login'>Войти</Link>
      </div>
    </div>
  );
}

export default RegisterPage;
