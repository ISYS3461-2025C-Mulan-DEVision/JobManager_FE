import React from "react";
import { useDispatch, useSelector } from "react-redux";

export default function Home() {
  const dispatch = useDispatch();
  const loading = useSelector((state: any) => state.app?.loading);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Home</h1>
      <div className="mb-4">Loading: {String(loading)}</div>
      <button
        onClick={() => dispatch({ type: "APP/SET_LOADING", payload: !loading })}
        className="px-3 py-2 bg-blue-600 text-white rounded"
      >
        Toggle Loading
      </button>
    </div>
  );
}
