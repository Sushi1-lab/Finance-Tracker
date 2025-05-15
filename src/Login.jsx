import { useState } from 'react';

function Login({ users, onLogin }) {
  const [name, setName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return alert("Please enter your name.");
    onLogin(name);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-300">
      <form
        onSubmit={handleSubmit}
        className="bg-amber-100 p-6 rounded shadow-md w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold mb-4">Enter your Username</h2>
        <input
          type="text"
          placeholder="Enter your username"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 mb-4 border rounded"
        />
        <button
          type="submit"
          className="w-full bg-blue-800 text-white p-2 rounded hover:bg-blue-900"
        >
          Enter
        </button>
      </form>
    </div>
  );
}

export default Login;
