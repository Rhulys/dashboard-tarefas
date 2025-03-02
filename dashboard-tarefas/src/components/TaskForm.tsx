"use client";

import { useState } from "react";

export default function TaskForm({
    onAddTask,
}: {
    onAddTask: (task: string) => void;
}) {
    const [task, setTask] = useState("");

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!task.trim()) return;

        onAddTask(task);
        setTask("");
    }

    return (
        <form onSubmit={handleSubmit} className="flex gap-2 mt-4">
            <input
                type="text"
                value={task}
                onChange={(e) => setTask(e.target.value)}
                className="border border-gray-300 p-2 rounded w-full"
                placeholder="Digite uma nova tarefa..."
            />
            <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
            >
                Adicionar
            </button>
        </form>
    );
}
