import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoadingSpinner } from '../components';

export default function Admin() {
  const [error, setError] = useState<unknown>();
  const [isLoading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    setLoading(true);
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    try {
      const req = {
        method: 'POST',
        body: formData,
      };
      const res = await fetch('/upload', req);
      const result = await res.json();
      if (!result) {
        return <div className="text-red-900 text-2xl">Item was not added</div>;
      }
      setLoading(false);
      navigate(`/products/${result.productId}`);
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
    <div className="container flex justify-center mt-10">
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
          <div className="mb-3 flex flex-col ">
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
                <option value="game">Games</option>
                <option value="other">Other</option>
              </select>
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
        <div className="w-10/12">
          <div className="mb-3">
            <label className="form-label flex flex-col">
              Long Description:
              <textarea
                name="longDescription"
                className="form-control border-2 rounded-lg ml-1"
                rows={10}
              />
            </label>
          </div>
        </div>
      </form>
    </div>
  );
}
