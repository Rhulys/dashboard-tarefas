"use client";
import { useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AuthContext } from "@/context/AuthContext";
import { motion } from "framer-motion";
import TaskForm from "@/components/TaskForm";
import TaskProgress from "@/components/TaskProgress";
import { useQuery, useMutation, gql } from "@apollo/client";

const GET_TASKS = gql`
    query {
        tasks {
            id
            text
            completed
            estimatedTime
        }
    }
`;

const ADD_TASK = gql`
    mutation AddTask($text: String!) {
        addTask(text: $text) {
            id
            text
            completed
            estimatedTime
        }
    }
`;

const REMOVE_TASK = gql`
    mutation RemoveTask($id: ID!) {
        removeTask(id: $id)
    }
`;

const TOGGLE_TASK = gql`
    mutation ToggleTask($id: ID!) {
        toggleTask(id: $id) {
            id
            completed
        }
    }
`;

const PREDICT_COMPLETION_TIME = gql`
    mutation PredictCompletionTime($id: ID!) {
        predictCompletionTime(id: $id)
    }
`;

export default function Home() {
    const authContext = useContext(AuthContext);
    const router = useRouter();

    const { data, loading, error, refetch } = useQuery(GET_TASKS, {
        skip: !authContext?.token,
    });

    const [addTask] = useMutation(ADD_TASK, { onCompleted: refetch });
    const [removeTask] = useMutation(REMOVE_TASK, { onCompleted: refetch });
    const [toggleTask] = useMutation(TOGGLE_TASK, { onCompleted: refetch });
    const [predictCompletionTime] = useMutation(PREDICT_COMPLETION_TIME);

    useEffect(() => {
        if (!authContext?.token) {
            router.push("/login");
        }
    }, [authContext?.token]);

    if (!authContext?.token)
        return (
            <p className="texte-center mt-6">Redirecionando para login...</p>
        );

        console.log("Daddos carregados:", data)

    if (loading) return <p className="text-center mt-6">Carregando</p>;
    if (error)
        return (
            <p className="text-center mt-6 text-red-500">
                Erro ao carregar tarefas...
            </p>
        );

    async function handleAddTask(text: string) {
        await addTask({ variables: { text } });
    }

    async function handleRemoveTask(id: string) {
        await removeTask({ variables: { id } });
    }

    async function handleToggleTask(id: string) {
        await toggleTask({ variables: { id } });
    }

    async function handlePredictTime(taskId: string) {
        const { data } = await predictCompletionTime({
            variables: { id: taskId },
        });

        if (!data?.predictCompletionTime) return;

        refetch();
    }

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <h1 className="text-3xl font-bold text-center text-blue-600">
                Dashboard de Tarefas
            </h1>

            <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md mt-6">
                <h2 className="text-xl font-semibold mb-4">Minhas Tarefas</h2>

                <TaskForm onAddTask={handleAddTask} />

                <ul className="space-y-2 mt-4">
                    {data?.tasks.map(
                        (task: {
                            id: string;
                            text: string;
                            completed: boolean;
                            estimatedTime: string;
                        }) => (
                            <motion.li
                                key={task.id}
                                className={`bg-gray-200 p-2 rounded flex flex-col gap-2 ${
                                    task.completed
                                        ? "bg-green-200"
                                        : "bg-gray-200"
                                }`}
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, x: -50 }}
                                transition={{ duration: 0.3 }}
                            >
                                <div className="flex justify-between items-center">
                                    <span
                                        className={`${
                                            task.completed ? "line-through" : ""
                                        }`}
                                    >
                                        {task.text}
                                    </span>

                                    <div className="flex gap-2">
                                        <button
                                            onClick={() =>
                                                handleToggleTask(task.id)
                                            }
                                            className={`px-3 py-1 rounded transition ${
                                                task.completed
                                                    ? "bg-gray-400 text-white"
                                                    : "bg-green-500 text-white"
                                            }`}
                                        >
                                            {task.completed
                                                ? "⏪ Reabrir"
                                                : "✔ Concluir"}
                                        </button>

                                        <button
                                            onClick={() =>
                                                handleRemoveTask(task.id)
                                            }
                                            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                                        >
                                            ✖
                                        </button>
                                    </div>
                                </div>

                                {!task.completed && (
                                    <button
                                        onClick={() =>
                                            handlePredictTime(task.id)
                                        }
                                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition"
                                    >
                                        📊 Prever Tempo de Conclusão
                                    </button>
                                )}

                                {!task.completed && (
                                    <>
                                        {task.estimatedTime && (
                                            <p className="text-gray-600 text-sm mt-1">
                                                🕒 Previsão de conclusão:
                                                <strong>
                                                    {task.estimatedTime}
                                                </strong>
                                            </p>
                                        )}
                                    </>
                                )}
                            </motion.li>
                        )
                    )}
                </ul>

                <TaskProgress
                    total={data?.tasks.length}
                    completed={
                        data?.tasks.filter(
                            (t: { completed: boolean }) => t.completed
                        ).length
                    }
                />

                <button
                    onClick={() => {
                        localStorage.removeItem("token");
                        localStorage.removeItem("user");
                        router.push("/login");
                    }}
                    className="bg-red-500 text-white px-4 py-2 rounded mt-4"
                >
                    🚪 Sair
                </button>
            </div>
        </div>
    );
}
