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
    if (!res.ok) throw new Error(`fetch Error ${res.status}`);
    const user: UsersProps = await res.json();
    return user;
  }

  /**
   * Grabs products according to type of product
   * @param type string representing what type of item to get
   * @returns an object with all product data
   */
  async function getProducts(type: string) {
    const req = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ type: type }),
    };
    const res = await fetch('/catalog', req);
    if (!res.ok) throw new Error(`fetch Error ${res.status}`);
    const products = await res.json();
    return products;
  }

  /**
   * gets individual product details specified by product ID
   * @param productId id of the product being viewed
   * @returns an object with the data of 1 product
   */
  async function getProduct(productId: string | undefined | number) {
    productId = Number(productId);
    const res = await fetch(`/products/${productId}`);
    if (!res.ok) throw new Error(`fetch Error ${res.status}`);
    const product = await res.json();
    return product;
  }

  type Props = {
    product: {
      productId: number;
      name: string;
      price: number;
      imageUrl: string;
      shortDescription: string;
      longDescription: string;
      stock: number;
      type: string;
      quantity: number;
      userId: number | undefined;
    };
    quantity: number;
    user: UsersProps | undefined;
  };
  async function addToCart({ product, quantity, user }: Props) {
    const newProduct = product;
    newProduct.quantity = quantity;
    newProduct.userId = user?.user.userId;
    const req = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(product),
    };
    const res = await fetch('/add-to-cart', req);
    if (!res.ok) throw new Error(`fetch Error ${res.status}`);
    const cartItem = await res.json();
    return cartItem;
  }

  async function viewCart(userId: string | undefined) {
    const res = await fetch(`/cart/${userId}`);
    if (!res.ok) throw new Error(`Could not find cart`);
    const cart = await res.json();
    return cart;
  }

  type UpdateProps = {
    quantity: number;
    cartId: number;
    cartItemId: number;
  };
  async function updateCart({ quantity, cartId, cartItemId }: UpdateProps) {
    const product = {
      quantity: quantity,
      cartId: cartId,
      cartItemId: cartItemId,
    };
    const req = {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(product),
    };
    const res = await fetch('/cart/update', req);
    if (!res.ok) throw new Error(`Could not update cart`);
    const cart = await res.json();
    return cart;
  }

  type DeleteProps = {
    cartId: number | null;
    cartItemId: number;
  };

  async function deleteCartItem({ cartId, cartItemId }: DeleteProps) {
    const req = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ cartId, cartItemId }),
    };
    const res = await fetch('/cart/delete', req);
    if (!res.ok) throw new Error(`Could not delete cart item`);
  }

  return {
    signUpOrIn,
    getProducts,
    getProduct,
    addToCart,
    viewCart,
    updateCart,
    deleteCartItem,
  };
}
