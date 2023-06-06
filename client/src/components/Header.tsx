import { Link, Outlet } from 'react-router-dom';
import SearchBar from './SearchBar';

export default function Header(): JSX.Element {
  return (
    <div className="lg:container my-auto mx-auto">
      <div className="flex items-center border-b-2 justify-around">
        <div className="flex w-4/12 items-center justify-center">
          <img
            className="w-5/12"
            alt="pikachu logo"
            src="./images/pikachu-head.svg"
          />
          <h1 className="w-6/12">Gimme Pokemon</h1>
        </div>
        <div className="w-4/12">
          <SearchBar />
        </div>
        <div className="w-4/12">
          <h1 className="w-6/12">Sign in/Register</h1>
        </div>
      </div>
      {<Outlet />}
    </div>
  );
}
