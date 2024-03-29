import React, { useState, useEffect } from "react";
import { toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

const Home = () => {
    const [title, setTitle] = useState("");
    const [desc, setDesc] = useState("");
    const [editMode, setEditMode] = useState<{ [key: string]: boolean }>({});
    const [mainTask, setMainTask] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState("");

    const fetchData = async () => {
        try {
            const response = await fetch(
                "https://6603f1662393662c31d02f1b.mockapi.io/todolist"
            );
            if (!response.ok) {
                throw new Error("Failed to fetch todo list data");
            }
            const data = await response.json();
            setMainTask(data);
        } catch (error) {
            console.error("Error:", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!title.trim() || !desc.trim()) {
            toast.error("Please fill in both title and description fields");
            return;
        }
        try {
            const response = await fetch(
                "https://6603f1662393662c31d02f1b.mockapi.io/todolist",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ title, desc }),
                }
            );
            if (!response.ok) {
                throw new Error("Failed to add task");
            }
            fetchData();
            setDesc("");
            setTitle("");
            toast('sucessfull', {
                position: "bottom-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
                
                });
        } catch (error) {
            console.error("Error:", error);
            toast.error("Failed to add task");
        }
    };

    const deleteHandler = async (id: string) => {
        try {
            const response = await fetch(
                `https://6603f1662393662c31d02f1b.mockapi.io/todolist/${id}`,
                {
                    method: "DELETE",
                }
            );
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            fetchData();
            console.log("Item with ID:", id, "deleted successfully");
        } catch (error) {
            console.error("Error:", error);
        }
    };

    const handleSave = async (id: string, newTitle: string, newDesc: string) => {
        try {
            const response = await fetch(
                `https://6603f1662393662c31d02f1b.mockapi.io/todolist/${id}`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ title: newTitle, desc: newDesc }),
                }
            );

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const updatedData = mainTask.map(item => {
                if (item.id === id) {
                    return { ...item, title: newTitle, desc: newDesc };
                }
                return item;
            });
            setEditMode((prevState) => ({
                ...prevState,
                [id]: false,
            }));

            console.log("Task with ID:", id, "updated successfully");
        } catch (error) {
            console.error("Error:", error);
        }
    };

    const handleEdit = (id: string) => {
        setEditMode((prevState) => ({
            ...prevState,
            [id]: true,
        }));
    };

    const filteredTasks = mainTask.filter(task => task.title.toLowerCase().includes(searchQuery.toLowerCase()));

    let renderTask = <h2 className="text-black">No Task Available</h2>;
    if (filteredTasks.length > 0) {
        renderTask = filteredTasks?.map((task) => (
            <li key={task.id}>
                <div className="flex justify-between mb-2">
                    {editMode[task.id] ? (
                        <>
                            <input
                                type="text"
                                defaultValue={task.title}
                                onChange={(e) => task.title = e.target.value}
                                className="border-black border-4 m-1 px-2 py-1 rounded-xl text-blue-500 w-[200px]"
                            />
                            <input
                                type="text"
                                defaultValue={task.desc}
                                onChange={(e) => task.desc = e.target.value}
                                className="border-black border-4 m-1 px-2 py-1 rounded-xl text-blue-500 w-[200px]"
                            />
                            <button
                                className="bg-green-800 p-1 rounded-2xl"
                                onClick={() => handleSave(task.id, task.title, task.desc)}
                            >
                                SAVE
                            </button>
                        </>
                    ) : (
                        <>
                            <h5 className="text-bold">{task.title}</h5>
                            <h6 className="text-bold">{task.desc}</h6>
                            <button
                                onClick={() => handleEdit(task.id)}
                                className="bg-amber-300  p-1 rounded-2xl text-white"
                            >
                                EDIT
                            </button>
                        </>
                    )}
                    <button
                        onClick={() => deleteHandler(task.id)}
                        className="bg-red-600 text-white font-sans text-bold rounded-lg text-lg p-1"
                    >
                        Delete
                    </button>
                </div>
            </li>
        ));
    }

    return (
        <>
            <div className="w-full flex justify-center bg-white h-[750px] pt-[100px]">
                <div className="w-[800px] bg-black h-[600px] rounded-xl">
                    <h1 className="text-white font-bold text-center text-5xl font-sans pt-2">
                        My Todo List
                    </h1>
                    <form className="bg-transparent text-center" onSubmit={submitHandler}>
                        <input
                            type="text"
                            className="border-black border-4 m-5 px-5 py-3 rounded-xl text-blue-500"
                            placeholder="Enter The Task Here"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                        <input
                            type="text"
                            className="border-black border-4 m-5 px-5 py-3 rounded-xl text-blue-500"
                            placeholder="Enter Description"
                            value={desc}
                            onChange={(e) => setDesc(e.target.value)}
                        />
                        <button className="bg-white text-black px-2 py-3 rounded-xl m-4">
                            Add Task
                        </button>
                    </form>
                    <div className="w-full flex justify-center">
                    <input
                        type="text"
                        className="border-black border-4 m-5 px-5 py-3 rounded-xl text-blue-500 w-[300px]"
                        placeholder="Search Task"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    </div>
                    <hr />
                    <div className="w-full justify-center flex mt-2">
                        <div className="rounded-xl p-8 text-center text-2xl font-sans text-bold text-black w-[700px] mx-8 bg-white border-2-yellow-400">
                            <ul>{renderTask}</ul>
                        </div>
                    </div>
                </div>
            </div>
            
        </>
    );
};

export default Home;
