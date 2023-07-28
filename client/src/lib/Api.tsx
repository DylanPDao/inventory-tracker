export type UsersProps = {
  token: string;
  user: {
    userId: number;
    username: string;
    admin: boolean;
  };
};

export function Api() {
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
    if (!res.ok) throw new Error(`Sign In or Sign Up error ${res.status}`);
    const user: UsersProps = await res.json();
    return user;
  }

  /**
   * gets inventory
   * @param userId id of the inventory sheet returned
   * @returns an object with the data of all items
   */
  async function getInventory(userId: number | undefined) {
    const res = await fetch(`/api/inventory/${userId}`);
    if (!res.ok) throw new Error(`fetch Error ${res.status}`);
    const inventory = await res.json();
    return inventory;
  }

  async function deleteItem({ itemId }: { itemId: number }) {
    const req = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ itemId }),
    };
    const res = await fetch('/api/inventory/delete', req);
    if (!res.ok) throw new Error(`Could not delete cart item`);
  }

  async function getCategory(userId: number | undefined) {
    const res = await fetch(`/api/category/${userId}`);
    if (!res.ok) throw new Error(`fetch Error ${res.status}`);
    const category = await res.json();
    return category;
  }

  async function addItem(data: any) {
    const jsonData = JSON.stringify(data);
    const req = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: jsonData,
    };
    const res = await fetch('/api/inventory/add', req);
    if (!res.ok) throw new Error(`Could not add selected`);
  }

  async function getOrder(uuid: string) {
    const res = await fetch(`/api/order/${uuid}`);
    if (!res.ok) throw new Error(`Could not get order`);
    const order = await res.json();
    return order;
  }

  async function getAllOrders(userId: number | undefined) {
    const res = await fetch(`/api/all/order/${userId}`);
    if (!res.ok) throw new Error(`Could not get order`);
    const orders = await res.json();
    return orders;
  }
  return {
    signUpOrIn,
    getInventory,
    deleteItem,
    addItem,
    getCategory,
    getOrder,
    getAllOrders,
  };
}
