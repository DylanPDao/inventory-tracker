export function UseSignUpOrIn() {
  type UsersProps = {
    token: string;
    user: {
      userId: number;
      username: string;
      admin: string;
    };
  };

  /**
   * Signs up or signs in depending on the action.
   * @param {string} action Action to take, either 'sign-up' or 'sign-in'
   * @param {string} username The user's username.
   * @param {sting} password The user's password.
   * @returns Promise that resolves to user (sign-up) or `{ token, user }` (sign-in).
   */
  async function signUpOrIn(
    action: string,
    username: FormDataEntryValue,
    password: FormDataEntryValue
  ) {
    const req = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    };
    const res = await fetch(`/${action}`, req);
    if (!res.ok) throw new Error(`fetch Error ${res.status}`);
    const user: UsersProps = await res.json();
    return user;
  }

  return {
    signUpOrIn,
  };
}
