import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PlusIcon, XMarkIcon } from "@heroicons/react/24/solid";

const FloatingMenu = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  return (
 <div className="fixed bottom-10 right-6 z-50 flex flex-col items-end gap-3">
  
  {open && (
    <div className="
      bg-white
      shadow-2xl
      rounded-xl
      p-3
      flex flex-col gap-2
      w-52
      sm:w-56">

      <button
        onClick={() => navigate("/addexpense")}
        className="text-left px-3 py-2 rounded hover:bg-gray-100 transition"
      >
        ➕ Add Expense
      </button>

      <button
        onClick={() => navigate("/makepayment")}
        className="text-left px-3 py-2 rounded hover:bg-gray-100 transition"
      >
        💳 New Payment
      </button>

      <button
        onClick={() => navigate("/groups")}
        className="text-left px-3 py-2 rounded hover:bg-gray-100 transition"
      >
        👤 New Member
      </button>
    </div>
  )}



<button
  onClick={() => setOpen(!open)}
  className="
    w-14 h-14
    rounded-full
    bg-green-600
    hover:bg-green-700
    text-white
    flex items-center justify-center
    shadow-xl
    transition">
  {open ? (
    <XMarkIcon className="w-6 h-6" />
  ) : (
    <PlusIcon className="w-6 h-6" />
  )}
</button>

</div>

  );
};

export default FloatingMenu;
