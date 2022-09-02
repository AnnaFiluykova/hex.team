import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import RegisterPage from './components/RegisterPage';
import LoginPage from './components/LoginPage';
import MainPage from './components/MainPage';
import Layout from './components/Layout';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Layout />}>
          <Route path='/login' element={<LoginPage />} />
          <Route path='/main' element={<MainPage />} />
        </Route>
        <Route path='/register' element={<RegisterPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
