import './App.css';
import { Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import { UserContext } from './lib/UserContext';
import { UsersProps } from './lib/Api';
import Header from './components/Header';
import { SignInOrUpForm, NotFound, SignOut } from './pages';
function App() {
  const [user, setUser] = useState<UsersProps>();

  return (
    <div className="App">
      <UserContext.Provider value={user}>
        <Routes>
          <Route path="/" element={<Header />}>
            <Route
              path="/"
              element={<SignInOrUpForm user={setUser} action="sign-in" />}
            />
            <Route
              path="/sign-up"
              element={<SignInOrUpForm user={setUser} action="sign-up" />}
            />
            <Route path="/sign-out" element={<SignOut user={setUser} />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </UserContext.Provider>
    </div>
  );
}

export default App;
