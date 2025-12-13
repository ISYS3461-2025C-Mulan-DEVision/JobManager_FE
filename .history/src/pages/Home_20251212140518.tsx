import React from "react";
import { useDispatch, useSelector } from "react-redux";
import actions from "../redux/app/actions";

export default function Home() {
    const dispatch = useDispatch();
    const loading = useSelector((state: any) => state.app?.loading);

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4 text-heading-text">This is the landing page</h1>
            <div className="mb-4">Loading: {String(loading)}</div>
            <button
                onClick={() => dispatch(actions.toggleLoadingAsync(!loading))}
                className="px-3 py-2 bg-blue-600 text-white rounded"
            >
                Toggle Loading (async)
            </button>
        </div>
    );
}
