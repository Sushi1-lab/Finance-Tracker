import { useState, useEffect } from "react";
import { db } from './firebase';
import { collection, getDocs, addDoc, updateDoc, doc, deleteDoc } from "firebase/firestore";
import Login from "./Login";
import Expenses from './expenses';
import { Menu, X } from "lucide-react";

function App() {
  const [newName, setNewName] = useState("");
  const [newAge, setNewAge] = useState();
  const [users, setUsers] = useState([]);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [showExpenses, setShowExpenses] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
      if (!user.isAdmin) {
        setShowExpenses(true);
      }
    } else {
      alert("The Account is not existing");
    }
  };

  const handleLogout = () => {
    setLoggedInUser(null);
    setShowExpenses(false);
    setIsMobileMenuOpen(false);
  };

  const createUser = async () => {
    if (!newName.trim()) return alert("Name is required.");
    if (!newAge || Number(newAge) <= 0) return alert("Enter a valid age.");

    await addDoc(usersCollectionRef, { name: newName.trim(), age: Number(newAge), expenses: [], isAdmin: false });
    setNewName("");
    setNewAge();
    getUsers();
  };

  const updateUser = async (id, age) => {
    const userDoc = doc(db, "users", id);
    await updateDoc(userDoc, { age: age + 1 });
    getUsers();
  };

  const [selectedUser, setSelectedUser] = useState(null);

  const deleteUser = async (id) => {
    const userDoc = doc(db, "users", id);
    await deleteDoc(userDoc);
    getUsers();
  };

  if (!loggedInUser) {
    return <Login users={users} onLogin={handleLogin} />;
  }

  return (
    <div className=" bg-[url(bg3.jpg)] bg-no-repeat bg-cover bg-center min-h-screen flex flex-col items-center">
      {/* Navigation Bar */}
      <nav className="w-full bg-white px-4 py-4 shadow-md sticky top-0 z-10 mb-5">
        <div className="flex items-center justify-between max-w-5xl mx-auto">
          <div className="text-xl font-semibold text-blue-950">
            Welcome, {loggedInUser.name}
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-6 text-blue-950 font-medium text-xl ">
            {loggedInUser.isAdmin && (
              <button
                onClick={() => setShowExpenses(false)}
                className="hover:text-blue-700 transition"
              >
                Users
              </button>
            )} <div></div>
            <button
              onClick={() => setShowExpenses(true)}
              className="hover:text-blue-700 transition"
            >
              Expenses
            </button> <div></div>
            <button
              onClick={handleLogout}
              className="hover:text-blue-700 transition"
            >
              Logout
            </button>
          </div>

          {/* Burger Menu Icon */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-blue-950"
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div
            className={`md:hidden overflow-hidden transition-all duration-500 ease-in-out ${
              isMobileMenuOpen ? "max-h-60 mt-4" : "max-h-0"
            }`}
          >
            <div className="flex flex-col space-y-2 text-blue-950 font-medium px-4">
              {loggedInUser.isAdmin && (
                <button
                  onClick={() => {
                    setShowExpenses(false);
                    setIsMobileMenuOpen(false);
                  }}
                  className="hover:text-blue-700 transition"
                >
                  Users
                </button>
              )}
              <button
                onClick={() => {
                  setShowExpenses(true);
                  setIsMobileMenuOpen(false);
                }}
                className="hover:text-blue-700 transition"
              >
                Expenses
              </button>
              <button
                onClick={handleLogout}
                className="hover:text-blue-700 transition"
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </nav>

      <div className="text-3xl font-bold my-6 text-white">
        {showExpenses ? "Expenses" : "Add User"}
      </div>

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
              className="w-full bg-blue-800 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
            >
              Create User
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-4xl">
          {users.map((user) => (
          <div key={user.id} className="bg-white shadow-md rounded-lg p-4">
            <h2 className="text-xl font-semibold">{user.name}</h2>
            <p className="text-gray-700">Age: {user.age}</p>
            
            <div className="flex flex-wrap gap-2 mt-4">
              <button
                className="bg-blue-800 text-white py-1 px-3 rounded hover:bg-blue-700 transition"
                onClick={() => updateUser(user.id, user.age)}
              >
                Increase Age
              </button>
              <button
                className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600 transition"
                onClick={() => deleteUser(user.id)}
              >
                Delete User
              </button>
              <button
                className="bg-blue-800 text-white py-1 px-3 rounded hover:bg-blue-700 transition"
                onClick={() =>
                  setSelectedUser((prev) => (prev?.id === user.id ? null : user))
                }
              >
                {selectedUser?.id === user.id ? "Hide Expenses" : "View Expenses"}
              </button>
            </div>

            {selectedUser?.id === user.id && (
            <div className="mt-4">
              <Expenses user={user} readonly={true} />
            </div>
          )}
          </div>
        ))}
          </div>
        </>
      ) : (
        <p className="text-red-600 font-semibold text-lg">
          You are not authorized to access User Management.
        </p>
      )}
    </div>
  );
}

export default App;
