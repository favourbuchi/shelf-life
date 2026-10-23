import { useState, useEffect } from "react";

export default function App() {
  // TASK 1: State Initialization
  // - Initialize 'items' state using a lazy function reading from localStorage ('shelflife_data')
  // - Default to an empty array [] if nothing is stored in localStorage
  // - Declare controlled input states: 'title' (string) and 'rating' (number or string, default 5)
  const [title, setTitle] = useState("");
  const [rating, setRating] = useState("5");

  const [items, setItems] = useState(() => {
    const savedItems = localStorage.getItem("shelflife_data")
    return savedItems ? JSON.parse(savedItems) : []
  });

  // TASK 2: Side Effect (Persistence)
  // - Set up a useEffect hook that listens to the 'items' state
  // - Sync 'items' to localStorage under the key 'shelflife_data' whenever it updates
  useEffect(() => {
    localStorage.setItem("shelflife_data", JSON.stringify(items))
  }, [items])

  // TASK 3: Derived State Calculations (No useState!)
  // - Calculate total items countkkkkk
  const totalItems = items.length
  // - Calculate completed items count (use items.filter(...).length)
  const completedItems = items.filter((item) => item.isRead).length
  // console.log(completedItems)

  // TASK 4: Form Submit Handler
  // - Prevent default browser form refresh
  // - Guard check: ensure title is not empty (use .trim())
  // - Create new book object: { id: Date.now(), title, rating: Number(rating), isRead: false }
  // - Update 'items' immutably using the functional updater and spread operator
  // - Reset title back to "" and rating back to 5

  function handleAddItems(e) {
    e.preventDefault();
    if (!title.trim()) return;

    const newItem = {
      id: Date.now(),
      title,
      rating: Number(rating),
      isRead: false,
    };

    setItems((prevItems) => [...prevItems, newItem]);

    // reset 
    setTitle('')
    setRating('5')
  }

  // TASK 5: Toggle Status Handler
  // - Accept an item's unique id
  // - Update 'items' immutably with .map() to flip the 'isRead' boolean on the matched item toggles
  function toggleStatus(id) {
    setItems((prevItems) => {
      return prevItems.map((item) => {
        if (item.id === id) {
          return {
          ...item,
          isRead: !item.isRead 
          }          
        } else return item
        
      })
    })
  }

  // TASK 6: Delete Handler
  // - Accept an item's unique id
  // - Filter out the targeted item immutably from 'items'
  function handleDelete(indexToDelete) {
    setItems((prevItems) => {
      const newTasks =  prevItems.filter((_, index) => {
        return index !== indexToDelete
      })
      return newTasks
    })
  }

  // console.log(title, rating)
  // console.log(items);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
        {/* Header Block */}
        <div className="flex justify-between items-center border-b border-slate-800 pb-4">
          <div>
            <h1 className="text-xl font-bold text-black tracking-tight">
              ShelfLife
            </h1>
            <p className="text-xs text-slate-800">Media & Reading Tracker</p>
          </div>
          <div className="text-right">
            <span className="text-xs text-slate-400 uppercase font-semibold">
              Progress
            </span>
            {/* Display completed count / total count derived values here */}
            <p className="text-sm font-bold text-amber-500"> {completedItems} / {totalItems} Done</p>
          </div>
        </div>

        {/* Input Form */}
        {/* Wire this form to your submit handler */}
        <form onSubmit={handleAddItems} className="space-y-3">
          {/* Wire this input: value & onChange */}
          <input
            type="text"
            placeholder="Book or game title..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-amber-500 transition-colors"
            onChange={(event) => setTitle(event.target.value)}
            value={title}
          />

          <div className="flex gap-2">
            {/* Wire this select: value & onChange */}
            <select
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-slate-300 focus:outline-none focus:border-amber-500"
              onChange={(event) => setRating(event.target.value)}
              value={rating}
            >
              <option value="5">⭐⭐⭐⭐⭐ (5/5)</option>
              <option value="4">⭐⭐⭐⭐ (4/5)</option>
              <option value="3">⭐⭐⭐ (3/5)</option>
              <option value="2">⭐⭐ (2/5)</option>
              <option value="1">⭐ (1/5)</option>
            </select>

            <button
              type="submit"
              className="w-32 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-sm transition-all active:scale-95"
            >
              Add
            </button>
          </div>
        </form>

        {/* List Section */}
        <ul className="space-y-2 max-h-64 overflow-y-auto">
          {/* TASK 7: Render dynamic list items */}
          {/* 
            - Map over the 'items' array
            - Render an <li> for each with a key={item.id}
            - Style conditionally based on item.isRead (e.g. line-through if completed)
            - Connect the Toggle button to your toggle handler
            - Connect the Delete button to your delete handler
          */}
          {items.map((item, index) => {
            return (
              <li  key={item.id} className="flex items-center justify-between bg-slate-950 border border-slate-800/80 rounded-xl px-4 py-3 text-sm">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    className="w-5 h-5 rounded border border-slate-700 flex items-center justify-center text-xs text-green-500"
                    onClick={() => toggleStatus(item.id)}
                  >
                    {item.isRead ? '✓' : ''}
                  </button>
                  <div>
                    <p className="font-medium text-slate-200">{item.title}</p>
                    <span className="text-[10px] text-slate-400">
                      Rating: {item.rating}/5
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  className="text-slate-500 hover:text-rose-400 text-sm font-semibold transition-colors px-2 py-1"
                  onClick={() => handleDelete(index)}
                >
                  &times;
                </button>
              </li>
            );
          })}

          {/* Example static item for visual layout: */}
        </ul>
      </div>
    </div>
  );
}
