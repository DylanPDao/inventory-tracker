import { FormEvent, useState, useContext, useEffect } from 'react';
import { LoadingSpinner } from './';
import { UserContext, Api } from '../lib';
import { TableRowType } from '../pages/Inventory';

type ModalType = {
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
  setInventory: React.Dispatch<
    React.SetStateAction<TableRowType[] | undefined>
  >;
};

export default function Modal({ setModal, setInventory }: ModalType) {
  const { addItem, getInventory, getCategory } = Api();
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState<unknown>();
  const user = useContext(UserContext);
  const [category, setCategory] = useState<any[] | undefined>();

  useEffect(() => {
    async function getCat() {
      try {
        const cat = await getCategory(user?.user.userId);
        setCategory(cat);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }
    if (!category) getCat();
  }, [category, getCategory, user?.user.userId]);

  let categoryTsx: any[] = [];

  if (category) {
    categoryTsx = category.map(
      (cat: { userId: number; categoryId: number; categoryName: string }) => (
        <option key={cat.categoryId} value={cat.categoryId}>
          {cat.categoryName}
        </option>
      )
    );
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    // setLoading(true);
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData);
    const reqData = {
      formData: data,
      userId: user?.user.userId,
    };
    try {
      await addItem(reqData);
      const inv = await getInventory(user?.user.userId);
      setInventory(inv);
      setModal(false);
      setLoading(false);
    } catch (err) {
      setError(err);
    }
  }

  if (isLoading) return <LoadingSpinner />;

  if (error) {
    console.error('Fetch error:', error);
    return <div>{`Error! ${error}`}</div>;
  }

  return (
    <>
      <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
        <div className="relative w-auto my-6 mx-auto max-w-3xl">
          <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
            <div className="flex flex-col p-5 border-b border-solid border-gold rounded-t">
              <div className="flex items-start justify-between">
                <h4 className="text-2xl font-semibold">Add Item/Category</h4>
                <button
                  onClick={() => setModal(false)}
                  className="p-1 ml-auto border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none">
                  <span className="text-black h-6 w-6 text-2xl">×</span>
                </button>
              </div>
              <p className="text-red-500">Add one or the other</p>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="relative p-4 flex-auto">
                <div className="flex flex-col">
                  <label className="form-label flex border-b border-gold mb-4 pb-4">
                    Category:
                    <input
                      type="text"
                      name="category"
                      className="m-1 form-control border rounded-lg w-full border-gold"
                    />
                  </label>
                  <label className="form-label flex">
                    Item:
                    <input
                      type="text"
                      name="item"
                      className="m-1 form-control border rounded-lg w-full border-gold"
                    />
                  </label>
                  <label className="form-label flex">
                    Select Category
                    <select
                      name="itemCategory"
                      className="form-control border-2 rounded-lg ml-1 w-6/12">
                      {categoryTsx}
                    </select>
                  </label>
                </div>
              </div>
              <div className="flex items-center justify-end p-6 border-t border-solid border-gold rounded-b">
                <button
                  className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                  type="button"
                  onClick={() => setModal(false)}>
                  Close
                </button>
                <button
                  className="bg-gold text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                  type="submit">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
    </>
  );
}
