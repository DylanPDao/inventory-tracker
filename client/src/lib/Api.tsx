import { CartProps } from '../pages/Cart';

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
   * gets individual product details specified by product ID
   * @param productId id of the product being viewed
   * @returns an object with the data of 1 product
   */
  async function getProduct(productId: string | undefined | number) {
    productId = Number(productId);
    const res = await fetch(`/api/products/${productId}`);
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
      longDescription: string;
      stock: number;
      type: string;
      priceId: string;
      quantity: number;
      userId: number | undefined;
    };
    quantity: number;
    user: UsersProps | undefined;
  };
  /**
   * adds item to cart
   * @param param0 product object, quantity to be added, and user to be associated to cart
   * @returns product
   */
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

  /**
   *
   * @param userId id of user
   * @returns array of cart item objects
   */
  async function viewCart(userId: string | number | undefined) {
    const res = await fetch(`/api/cart/${userId}`);
    if (!res.ok) throw new Error(`Could not find cart`);
    const cart = await res.json();
    return cart;
  }

  type UpdateProps = {
    quantity: number;
    cartId: number | null;
    cartItemId: number;
  };
  /**
   *
   * @param param0 new quantity of cart item, id of cart item, and id of cart to be updated
   */
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
    const res = await fetch('/api/cart/update', req);
    if (!res.ok) throw new Error(`Could not update cart`);
  }

  type DeleteProps = {
    cartId: number | null;
    cartItemId: number;
  };
  /**
   *
   * @param param0 cart id and id of cart item
   */
  async function deleteCartItem({ cartId, cartItemId }: DeleteProps) {
    const req = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ cartId, cartItemId }),
    };
    const res = await fetch('/api/cart/delete', req);
    if (!res.ok) throw new Error(`Could not delete cart item`);
  }

  /**
   *
   * @param cart array of priceid and quantity
   * @returns url to be redirected to for stripe
   */
  async function checkout(cart: CartProps[]) {
    const req = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ cart: cart }),
    };
    const res = await fetch('/api/checkout', req);
    // if (!res.url) throw new Error(`Could not checkout`);
    const url = await res.json();
    return url;
  }

  return {
    signUpOrIn,
    getProduct,
    addToCart,
    viewCart,
    updateCart,
    deleteCartItem,
    checkout,
  };
}

/**
 * Grabs products according to type of product
 * @param type string representing what type of item to get
 * @returns an object with all product data
 */
type ProductProps = {
  type: string;
  searchString?: string | undefined;
};
export async function getProducts({ type, searchString }: ProductProps) {
  const req = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ type, searchString }),
  };
  const res = await fetch('/catalog', req);
  if (!res.ok) throw new Error(`fetch Error ${res.status}`);
  const products = await res.json();
  return products;
}
