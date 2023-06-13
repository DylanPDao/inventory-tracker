import { useNavigate } from 'react-router-dom';

type User = {
  user: React.Dispatch<React.SetStateAction<{} | undefined>>;
};

export default function SignOut({ user }: User) {
  const navigate = useNavigate();

  user(undefined);
  navigate('/');
  return <></>;
}
