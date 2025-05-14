import { useState, useEffect } from "react";
import { db } from './firebase';
import { collection, getDocs, addDoc, updateDoc, doc, deleteDoc } from "firebase/firestore";
import Login from "./Login";
import Expenses from './expenses';

function App() {
  const [newName, setNewName] = useState("");
  const [newAge, setNewAge] = useState(0);
  const [users, setUsers] = useState([]);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [showExpenses, setShowExpenses] = useState(false);

  const usersCollectionRef = collection(db, "users");

  const getUsers = async () => {
    const data = await getDocs(usersCollectionRef);
    setUsers(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  };

  useEffect(() => {
    getUsers();
  }, []);

  const handleLogin = (name) => {
    const user = users.find(u => u.name === name);
    if (user) {
      setLoggedInUser(user);
      // Automatically redirect non-admins to the Expenses page
      if (!user.isAdmin) {
        setShowExpenses(true);
      }
    } else {
      alert("User not found");
    }
  };

  const handleLogout = () => {
    setLoggedInUser(null);
    setShowExpenses(false);  // Reset to user management page after logout
  };

  const createUser = async () => {
    if (!newName.trim()) return alert("Name is required.");
    if (!newAge || Number(newAge) <= 0) return alert("Enter a valid age.");

    await addDoc(usersCollectionRef, { name: newName.trim(), age: Number(newAge), expenses: [], isAdmin: false });
    setNewName("");
    setNewAge(0);
    getUsers();
  };

  const updateUser = async (id, age) => {
    const userDoc = doc(db, "users", id);
    await updateDoc(userDoc, { age: age + 1 });
    getUsers();
  };

  const deleteUser = async (id) => {
    const userDoc = doc(db, "users", id);
    await deleteDoc(userDoc);
    getUsers();
  };

  if (!loggedInUser) {
    return <Login users={users} onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center ">
      
      {/* Navigation Bar */}
      <nav className="font-medium w-full text-xl mx-8 bg-amber-200 p-4 sm:px-8 lg:px-16 flex justify-between items-center rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
        <h2 className="text-blue-950 text-2xl font-semibold capitalize">Welcome, {loggedInUser.name}</h2>
        <div className="flex items-center space-x-6">
          {loggedInUser.isAdmin && (
            <button
              onClick={() => setShowExpenses(false)}
              className={`text-blue-950 hover:text-blue-700 transition-colors duration-200 `}
            >
              User Management
            </button>
          )}
          <div></div>
          <button
            onClick={() => setShowExpenses(true)}
            className={`text-blue-950 hover:text-blue-700 transition-colors duration-200`}
          >
            Expenses
          </button>
          <div></div>
          <button
            onClick={handleLogout}
            className="text-blue-950 ml-4 hover:text-blue-700 transition-colors duration-200"
          >
            Logout
          </button>
        </div>
      </nav>

      <h1 className="text-3xl font-bold mb-6 text-blue-700">{showExpenses ? "Expenses Calculator" : "User Management"}</h1>

      {showExpenses ? (
        <Expenses user={loggedInUser} refreshUsers={getUsers} />
      ) : loggedInUser.isAdmin ? (
        <>
          {/* User Management Form */}
          <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md mb-8">
            <input
              className="w-full p-2 mb-4 border rounded-md"
              placeholder="Name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />
            <input
              type="number"
              className="w-full p-2 mb-4 border rounded-md"
              placeholder="Age"
              value={newAge}
              onChange={(e) => setNewAge(e.target.value)}
            />
            <button
              onClick={createUser}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
            >
              Create User
            </button>
          </div>

          {/* Users List */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-4xl">
            {users.map((user) => (
              <div key={user.id} className="bg-white shadow-md rounded-lg p-4">
                <h2 className="text-xl font-semibold">{user.name}</h2>
                <p className="text-gray-700">Age: {user.age}</p>
                <button
                  className="mt-4 mr-2 bg-green-500 text-white py-1 px-3 rounded hover:bg-green-600 transition"
                  onClick={() => updateUser(user.id, user.age)}
                >
                  Increase Age
                </button>
                <div></div>
                <button
                  className="mt-4 bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600 transition"
                  onClick={() => deleteUser(user.id)}
                >
                  Delete User
                </button>
              </div>
            ))}
          </div>
        </>
      ) : (
        <p className="text-red-600 font-semibold text-lg">You are not authorized to access User Management.</p>
      )}
    </div>
  );
}

export default App;
