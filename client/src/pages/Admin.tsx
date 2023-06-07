import { FormEvent, useState } from 'react';

export default function Admin() {
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    console.log(Object.fromEntries(formData.entries()));
    let { name, price, shortDescription, stock, type, longDescription, image } =
      Object.fromEntries(formData.entries());
  }

  return (
    <div className="flex w-full justify-center items-center p-10">
      <form className="flex border-2 p-5 rounded-lg" onSubmit={handleSubmit}>
        <div className="flex-col justify-center items-center w-6/12">
          <div className="mb-3">
            <label className="form-label flex flex-col">
              Product Name:
              <input
                required
                autoFocus
                type="text"
                name="name"
                className="form-control border-2 rounded-lg ml-1"
              />
            </label>
          </div>
          <div className="mb-3">
            <label className="form-label flex flex-col">
              Price:
              <input
                required
                autoFocus
                type="text"
                name="price"
                className="form-control border-2 rounded-lg ml-1"
              />
            </label>
          </div>
          <div className="mb-3">
            <label className="form-label flex flex-col">
              Short Description:
              <textarea
                name="shortDescription"
                className="form-control border-2 rounded-lg ml-1"
                rows={6}
              />
            </label>
          </div>
          <div className="mb-3">
            <label className="form-label">
              Stock:
              <select
                name="stock"
                className="form-control border-2 rounded-lg ml-1">
                <option value={1}>1</option>
                <option value={2}>2</option>
                <option value={3}>3</option>
                <option value={4}>4</option>
                <option value={5}>5</option>
              </select>
            </label>
            <label className="form-label">
              Type:
              <select
                name="type"
                className="form-control border-2 rounded-lg ml-1">
                <option value="card">Card</option>
                <option value="set">Set</option>
                <option value="toys-plush">Toys/Plush</option>
                <option value="games">Games</option>
                <option value="other">Other</option>
              </select>
            </label>
          </div>
        </div>
        <div className="w-6/12">
          <div className="mb-3">
            <label className="form-label flex flex-col">
              Long Description:
              <textarea
                name="longDescription"
                className="form-control border-2 rounded-lg ml-1"
                rows={9}
              />
            </label>
          </div>
          <div className="mb-3 w-5/6 ml-auto mr-auto">
            <input
              className="border w-11/12 rounded-sm"
              required
              type="file"
              name="image"
              accept=".png, .jpg, .jpeg, .gif, .svg"
            />
          </div>
          <button type="submit" className="border rounded-lg p-2">
            Upload
          </button>
        </div>
      </form>
    </div>
  );
}
