import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Api, UsersProps } from '../lib/Api';
import LoadingSpinner from '../components/LoadingSpinner';

type Props = {
  action: string;
  user: React.Dispatch<React.SetStateAction<UsersProps | undefined>>;
};

export default function SignInOrUpForm({ action, user }: Props) {
  const { signUpOrIn } = Api();
  const navigate = useNavigate();
  const [error, setError] = useState<unknown>();
  const [isLoading, setLoading] = useState(false);
  const [formValues, setFormValues] = useState({
    username: 'admin',
    password: 'admin',
  });

  if (error) {
    console.error('Fetch error:', error);
    return <div>{`Error! ${error}`}</div>;
  }

  if (isLoading) return <LoadingSpinner />;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    let { username, password } = Object.fromEntries(formData.entries());
    try {
      setLoading(true);
      const result = await signUpOrIn(action, username, password);
      if (action === 'sign-up') {
        navigate('/sign-in');
        setFormValues({ username: '', password: '' });
      } else if (result.user && result.token) {
        user(result);
        navigate('/');
      }
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }

  const alternateActionTo = action === 'sign-up' ? '/sign-in' : '/sign-up';
  const alternateActionText =
    action === 'sign-up' ? 'Sign in instead' : 'Register now';
  const submitButtonText = action === 'sign-up' ? 'Register' : 'Log In';
  return (
    <div className="container flex w-full justify-center items-center p-10">
      <form className="border-2 p-6 rounded-lg" onSubmit={handleSubmit}>
        <p className="mb-4 text-lg">{submitButtonText}</p>
        <div className="mb-3">
          <label className="form-label flex">
            Username:
            <input
              required
              value={formValues.username}
              onChange={(e) =>
                setFormValues({ ...formValues, username: e.target.value })
              }
              autoFocus
              type="text"
              name="username"
              className="form-control border-2 rounded-lg ml-1"
            />
          </label>
        </div>
        <div className="mb-3">
          <label className="form-label flex">
            Password:
            <input
              value={formValues.password}
              onChange={(e) =>
                setFormValues({ ...formValues, password: e.target.value })
              }
              required
              type="password"
              name="password"
              className="form-control border-2 rounded-lg ml-1"
            />
          </label>
        </div>
        <div className="flex justify-between items-center">
          <small>
            <Link className="text-blue-400" to={alternateActionTo}>
              {alternateActionText}
            </Link>
          </small>
          <button type="submit" className="">
            {submitButtonText}
          </button>
        </div>
      </form>
    </div>
  );
}
