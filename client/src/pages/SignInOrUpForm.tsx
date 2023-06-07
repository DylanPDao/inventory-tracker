import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Api } from '../lib/Api';

type Props = {
  action: string;
  user: React.Dispatch<React.SetStateAction<{}>>;
};

export default function SignInOrUpForm({ action, user }: Props) {
  const { signUpOrIn } = Api();
  const navigate = useNavigate();
  const [error, setError] = useState<unknown>();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    let { username, password } = Object.fromEntries(formData.entries());
    try {
      const result = await signUpOrIn(action, username, password);
      if (action === 'sign-up') {
        navigate('/sign-in');
      } else if (result.user && result.token) {
        console.log(user);
        // user.setUser(result)
        navigate('/');
      }
    } catch (err) {
      setError(err);
    }
  }

  const alternateActionTo = action === 'sign-up' ? '/sign-in' : '/sign-up';
  const alternateActionText =
    action === 'sign-up' ? 'Sign in instead' : 'Register now';
  const submitButtonText = action === 'sign-up' ? 'Register' : 'Log In';
  return (
    <div className="flex w-full justify-center items-center p-10">
      <form className="border-2 p-10 rounded-lg" onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">
            Username:
            <input
              required
              autoFocus
              type="text"
              name="username"
              className="form-control border-2 rounded-lg ml-1"
            />
          </label>
        </div>
        <div className="mb-3">
          <label className="form-label">
            Password:
            <input
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
