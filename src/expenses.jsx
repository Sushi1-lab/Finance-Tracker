import { useState, useEffect } from "react";
import { db } from './firebase';
import { doc, getDoc, updateDoc } from "firebase/firestore";

function Expenses({ user }) {
  const [transportation, setTransportation] = useState();
  const [bills, setBills] = useState();
  const [rent, setRent] = useState();
  const [food, setFood] = useState();
  const [total, setTotal] = useState(null);
  const [userExpenses, setUserExpenses] = useState([]);

  useEffect(() => {
    const fetchUserExpenses = async () => {
      try {
        const userDoc = await getDoc(doc(db, "users", user.id));
        const userData = userDoc.data();
        if (userData?.expenses) {
          setUserExpenses(userData.expenses);
        }
      } catch (error) {
        console.error("Error fetching user expenses: ", error);
      }
    };

    if (user?.id) {
      fetchUserExpenses();
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const totalAmount = transportation + bills + rent + food;
    setTotal(totalAmount);

    const newExpense = {
      transportation,
      bills,
      rent,
      food,
      total: totalAmount,
      createdAt: new Date().toISOString(),
    };

    try {
      const userRef = doc(db, "users", user.id);
      const userSnap = await getDoc(userRef);
      const userData = userSnap.data();

      const updatedExpenses = userData.expenses ? [...userData.expenses, newExpense] : [newExpense];

      await updateDoc(userRef, { expenses: updatedExpenses });

      setUserExpenses(updatedExpenses);
      alert("Expenses saved to your user profile!");
    } catch (error) {
      console.error("Error saving expenses to user: ", error);
      alert("There was an error saving your expenses.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-300 flex flex-col items-center p-6">
      <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-lg p-6">
        {[
          { id: 'transportation', label: 'Transportation', value: transportation, setter: setTransportation },
          { id: 'bills', label: 'Bills', value: bills, setter: setBills },
          { id: 'rent', label: 'Rent', value: rent, setter: setRent },
          { id: 'food', label: 'Food', value: food, setter: setFood },
        ].map(({ id, label, value, setter }) => (
          <div key={id} className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor={id}>{label}</label>
            <input
              type="number"
              id={id}
              className="w-full p-2 border rounded-md"
              value={value}
              onChange={(e) => setter(Number(e.target.value))}
              placeholder={`Enter ${label.toLowerCase()} expense`}
            />
          </div>
        ))}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
        >
          Calculate Total Expenses
        </button> 
      </form>

      {total !== null && (
        <div className="mt-6 bg-white p-4 rounded-lg shadow-md ">
          <h2 className="text-xl font-semibold text-gray-800">Total Monthly Expenses</h2>
          <p className="text-lg text-gray-700">Your total expenses are: <strong>${total}</strong></p>
        </div>
      )}

      <div className="mt-6 bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-800">Your Expense History</h2>
        {userExpenses.length === 0 ? (
          <p className="text-gray-700">No expenses recorded yet.</p>
        ) : (
          <ul>
            {userExpenses.map((exp, index) => (
              <li key={index} className="border-b py-2 text-sm">
                <p>
                  <strong>Transportation:</strong> ${exp.transportation} | 
                  <strong> Bills:</strong> ${exp.bills} | 
                  <strong> Rent:</strong> ${exp.rent} | 
                  <strong> Food:</strong> ${exp.food} | 
                  <strong> Total:</strong> ${exp.total} <br />
                  <span className="text-gray-500">Added on {new Date(exp.createdAt).toLocaleDateString()}</span>
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Expenses;
