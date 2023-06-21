import './App.css';
import { Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import { UserContext } from './lib/UserContext';
import { UsersProps } from './lib/Api';
import Header from './components/Header';
import {
  SignInOrUpForm,
  Admin,
  Catalog,
  NotFound,
  ProductDetails,
  SignOut,
  LandingPage,
  Cart,
  Success,
} from './pages';
function App() {
  const [user, setUser] = useState<UsersProps>();
  const [searchString, setSearchString] = useState<string | undefined>();

  return (
    <div className="App">
      <UserContext.Provider value={user}>
        <Routes>
          <Route path="/" element={<Header searchString={setSearchString} />}>
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
            <Route path="/catalog/cards" element={<Catalog type="card" />} />
            <Route
              path="/catalog/toys-plush"
              element={<Catalog type="toys-plush" />}
            />
            <Route path="/catalog/games" element={<Catalog type="game" />} />
            <Route path="/catalog/others" element={<Catalog type="other" />} />
            <Route
              path="/catalog/search"
              element={<Catalog type="search" searchString={searchString} />}
            />
            <Route path="/products/:productId" element={<ProductDetails />} />
            <Route path="/sign-out" element={<SignOut user={setUser} />} />
            <Route path="/cart/:userId" element={<Cart />} />
            <Route path="/success" element={<Success />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </UserContext.Provider>
    </div>
  );
}

export default App;
