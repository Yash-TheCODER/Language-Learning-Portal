import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import signupImg from '../assets/signupImg.jpeg';

export default function SignUp() {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await fetch('/api/v1/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        setLoading(false);
        setError(data.message);
        return;
      }
      setLoading(false);
      setError(null);
      navigate('/sign-in');
    } catch (error) {
      setLoading(false);
      setError(error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="container mx-auto flex px-5 py-24 md:flex-row flex-col items-center">
        {/* Image Section */}
        <div className="lg:max-w-lg lg:w-full md:w-1/2 w-5/6 mb-10 md:mb-0">
          <img
            className="object-cover object-center rounded"
            alt="signup"
            src={signupImg}
          />
        </div>
        {/* Form Section */}
        <div className="lg:flex-grow md:w-1/2 lg:pl-24 md:pl-16 flex flex-col md:items-start md:text-left items-center text-center">
          <h1 className="title-font sm:text-4xl text-3xl mb-4 font-medium text-gray-900">Sign Up</h1>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-md">
            <input
              type="text"
              placeholder="Name"
              className="border p-3 rounded-lg"
              id="NAME"
              onChange={handleChange}
            />
            <input
              type="email"
              placeholder="Email"
              className="border p-3 rounded-lg"
              id="EMAIL"
              onChange={handleChange}
            />
            <input
              type="password"
              placeholder="Password"
              className="border p-3 rounded-lg"
              id="PASSWORD"
              onChange={handleChange}
            />
            <input
              type="password"
              placeholder="Confirm Password"
              className="border p-3 rounded-lg"
              id="CONFIRM_PASSWORD"
              onChange={handleChange}
            />
            <button
              disabled={loading}
              className="inline-flex text-align-center text-white bg-slate-700 border-0 py-2 px-6 
              focus:outline-none hover:bg-slate-600 rounded text-lg text-center justify-center items-center">
              {loading ? 'Loading...' : 'Sign Up'}
            </button>
          </form>
          <div className="flex gap-2 mt-5 justify-center">
            <p>Have an account?</p>
            <Link to="/sign-in">
              <span className="text-blue-700">Sign in</span>
            </Link>
          </div>
          {error && <p className="text-red-500 mt-5">{error}</p>}
        </div>
      </div>
    </div>
  );
}



// import { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';


// export default function SignUp() {
//   const [formData, setFormData] = useState({});
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();
//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.id]: e.target.value,
//     });
//   };
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       setLoading(true);
//       const res = await fetch('/api/v1/signup', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(formData),
//       });
//       const data = await res.json();
//       console.log(data);
//       if (data.success === false) {
//         setLoading(false);
//         setError(data.message);
//         return;
//       }
//       setLoading(false);
//       setError(null);
//       navigate('/sign-in');
//     } catch (error) {
//       setLoading(false);
//       setError(error.message);
//     }
//   };
//   return (
//     <div className='p-3 max-w-lg mx-auto'>
//       <h1 className='text-3xl text-center font-semibold my-7'>Sign Up</h1>
//       <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
//         <input
//           type='text'
//           placeholder='Name'
//           className='border p-3 rounded-lg'
//           id='NAME'
//           onChange={handleChange}
//         />
//         <input
//           type='email'
//           placeholder='email'
//           className='border p-3 rounded-lg'
//           id='EMAIL'
//           onChange={handleChange}
//         />
//         <input
//           type='password'
//           placeholder='password'
//           className='border p-3 rounded-lg'
//           id='PASSWORD'
//           onChange={handleChange}
//         />
//         <input
//           type='password'
//           placeholder='confirm password'
//           className='border p-3 rounded-lg'
//           id='CONFIRM_PASSWORD'
//           onChange={handleChange}
//         />
//         <button
//           disabled={loading}
//           className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'
//         >
//           {loading ? 'Loading...' : 'Sign Up'}
//         </button>
//       </form>
//       <div className='flex gap-2 mt-5'>
//         <p>Have an account?</p>
//         <Link to={'/sign-in'}>
//           <span className='text-blue-700'>Sign in</span>
//         </Link>
//       </div>
//       {error && <p className='text-red-500 mt-5'>{error}</p>}
//     </div>
//   );
// }