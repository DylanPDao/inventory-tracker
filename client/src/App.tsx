import './App.css';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import SignInOrUpForm from './pages/SignInOrUpForm';
import NotFound from './pages/NotFound';
import { useState } from 'react';
import { UserContext } from './lib/UserContext';
import Admin from './pages/Admin';

function App() {
  const [user, setUser] = useState({});

  return (
    <div className="App">
      <UserContext.Provider value={user}>
        <Routes>
          <Route path="/" element={<Header />}>
            <Route
              path="sign-in"
              element={<SignInOrUpForm user={setUser} action="sign-in" />}
            />
            <Route
              path="sign-up"
              element={<SignInOrUpForm user={setUser} action="sign-up" />}
            />
            <Route path="/" element={<Admin />}></Route>
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </UserContext.Provider>
    </div>
  );
}

export default App;
