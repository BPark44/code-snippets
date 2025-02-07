"use client";

import { useState } from "react";

export default function Form() {
    const [state, setState] = useState({
        firstName: "",
        lastName: "",
        email: "",
        message: "",
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log(state);

        alert("Form submitted");
    };

    return (
        <div className="w-fit mx-auto border border-white rounded-lg p-4">
            <form onSubmit={handleSubmit}>
                <div className="flex flex-col gap-4">
                    <div className="flex justify-between gap-2">
                        <input
                            type="text"
                            placeholder="First Name"
                            className="text-black"
                            onChange={(e) =>
                                setState({
                                    ...state,
                                    firstName: e.target.value,
                                })
                            }
                        />

                        <input
                            type="text"
                            placeholder="Last Name"
                            className="text-black"
                            onChange={(e) =>
                                setState({ ...state, lastName: e.target.value })
                            }
                        />
                    </div>

                    <input
                        type="email"
                        placeholder="Email"
                        className="text-black"
                        onChange={(e) =>
                            setState({ ...state, email: e.target.value })
                        }
                    />

                    <textarea
                        placeholder="Message"
                        className="text-black"
                        onChange={(e) =>
                            setState({ ...state, message: e.target.value })
                        }
                    />

                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded-md"
                    >
                        Submit
                    </button>
                </div>
            </form>
        </div>
    );
}
