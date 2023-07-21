type ModalType = {
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function Modal({ setModal }: ModalType) {
  return (
    <>
      <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
        <div className="relative w-auto my-6 mx-auto max-w-3xl">
          <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
            <div className="flex items-start justify-between p-5 border-b border-solid border-gold rounded-t">
              <h3 className="text-3xl font-semibold">Add Item/Category</h3>
              <button
                onClick={() => setModal(false)}
                className="p-1 ml-auto border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none">
                <span className="text-black h-6 w-6 text-2xl">×</span>
              </button>
            </div>
            <div className="relative p-4 flex-auto">
              <form className="flex flex-col">
                <label className="form-label flex mr-2">
                  Category:
                  <input
                    type="text"
                    name="category"
                    className="m-1 form-control border-2 rounded-lg ml-1 w-full border-gold"
                  />
                </label>
                <label className="form-label flex mr-2">
                  Item:
                  <input
                    type="text"
                    name="item"
                    className="m-1 form-control border-2 rounded-lg ml-1 w-full border-gold"
                  />
                </label>
              </form>
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
                type="button">
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
    </>
  );
}
