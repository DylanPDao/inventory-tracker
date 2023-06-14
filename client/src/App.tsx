import './App.css';
import { Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import { UserContext } from './lib/UserContext';
import { UsersProps } from './lib/Api';
import Header from './components/Header';
import SignInOrUpForm from './pages/SignInOrUpForm';
import Admin from './pages/Admin';
import Catalog from './pages/Catalog';
import NotFound from './pages/NotFound';
import ProductDetails from './pages/ProductDetails';
import SignOut from './pages/SignOut';
import LoadingPage from './pages/LandingPage';
import LandingPage from './pages/LandingPage';

function App() {
  const [user, setUser] = useState<UsersProps>();

  return (
    <div className="App">
      <UserContext.Provider value={user}>
        <Routes>
          <Route path="/" element={<Header />}>
            <Route index element={<LandingPage />} />
            <Route
              path="/sign-in"
              element={<SignInOrUpForm user={setUser} action="sign-in" />}
            />
            <Route
              path="/sign-up"
              element={<SignInOrUpForm user={setUser} action="sign-up" />}
            />
            <Route path="/admin-add" element={<Admin />} />
            <Route path="/catalog/cards" element={<Catalog type="cards" />} />
            <Route
              path="/catalog/toys-plush"
              element={<Catalog type="toys-plush" />}
            />
            <Route path="/catalog/games" element={<Catalog type="game" />} />
            <Route path="/catalog/others" element={<Catalog type="other" />} />
            <Route path="/products/:productId" element={<ProductDetails />} />
            <Route path="/sign-out" element={<SignOut user={setUser} />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </UserContext.Provider>
    </div>
  );
}

export default App;
