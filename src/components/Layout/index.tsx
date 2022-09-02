import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, Outlet } from 'react-router-dom';

import Loader from '../Loader';
import { STATISTICS_URL } from '../../tools/api-list';

import { addAccessTokenToHeader } from '../../tools/auth';

const Layout = () => {
  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  const [authChecked, setAuthChecked] = useState<boolean>(false);

  useEffect(() => {
    if(token) {
      // Делаем проверочный запрос токена
      axios(STATISTICS_URL, {
        headers: {
          'accept': 'application/json',
          Authorization: `Bearer ${token}`
        },
        params: {
          limit: 1,
          offset: 0
        }
      })
        .then((resp) => {
          addAccessTokenToHeader(token as string);
          navigate('/main');
        })
        .catch((resp) => {
          if (resp.status === 401) {
            navigate('/login');
          }
        })
        .finally(() => {
          setAuthChecked(true)
        })
    } else {
      setAuthChecked(true);
      navigate('/login');
    }
  }, [token]);

  if (!authChecked) {
    return <Loader fixed={true} />;
  }

  return (
    <div>
      <Outlet />
    </div>
  )
}

export default Layout;
