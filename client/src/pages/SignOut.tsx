import { useNavigate } from 'react-router-dom';
import { UsersProps } from '../lib/Api';

type User = {
  user: React.Dispatch<React.SetStateAction<UsersProps | undefined>>;
};

export default function SignOut({ user }: User) {
  const navigate = useNavigate();

  user(undefined);
  navigate('/');
  return <></>;
}
