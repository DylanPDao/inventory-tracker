import { useNavigate } from 'react-router-dom';
import { UsersProps } from '../lib/Api';

type User = {
  user: React.Dispatch<React.SetStateAction<UsersProps | undefined>>;
};

export default function SignOut({ user }: User) {
  const navigate = useNavigate();
  user(undefined);
  return (
    <div className="container flex justify-center items-center">
      <div className="mt-12">
        <p className="mb-4 text-lg">Sign Out Success!</p>
        <button
          className="text-white w-6/12 text-xs m-2 p-2 bg-blue-700 hover:bg-blue-800 active:ring-4 rounded-lg text-center"
          onClick={() => navigate('/')}>
          Back to home!
        </button>
      </div>
    </div>
  );
}
