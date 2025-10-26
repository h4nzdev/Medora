import { MoreHorizontal } from "lucide-react";
import React, { useState } from "react";
import { handleDelete } from "./actionFunctions";

const ClientDesktopActions = ({ id, appointment }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <>
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="p-3 hover:bg-gradient-to-br hover:from-slate-100 hover:to-slate-200 rounded-xl text-slate-600 hover:text-slate-800 transition-all duration-300 hover:scale-110 shadow-sm hover:shadow-md"
          aria-label="More options"
        >
          <MoreHorizontal className="h-5 w-5 md:h-6 md:w-6" />
        </button>

        {isOpen && (
          <div
            className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl z-50 border border-white/20
            lg:top-full lg:bottom-auto bottom-full"
          >
            <button className="block px-4 py-3 text-base font-semibold text-slate-700 hover:bg-gradient-to-r hover:from-cyan-50 hover:to-sky-50 hover:text-cyan-700 w-full text-start border-b border-slate-200/50 transition-all duration-300">
              Edit
            </button>

            <button
              onClick={() => handleDelete(id, setIsLoading, setIsOpen)}
              disabled={isLoading}
              className="block px-4 py-3 text-base font-semibold text-slate-700 hover:bg-gradient-to-r hover:from-red-50 hover:to-red-50 hover:text-red-700 w-full text-start border-b border-slate-200/50 transition-all duration-300"
            >
              {isLoading ? "Deleting..." : "Delete"}
            </button>

            <button className="block px-4 py-3 text-base font-semibold text-slate-700 hover:bg-gradient-to-r hover:from-slate-50 hover:to-slate-100 hover:text-slate-800 w-full text-start transition-all duration-300">
              View
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default ClientDesktopActions;
