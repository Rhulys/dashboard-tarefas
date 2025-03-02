"use client"

import { PieChart, Pie, Cell, Tooltip } from "recharts"

export default function TaskProgress({total, completed}: {total: number; completed: number}) {
    const data = [
        {name: "Concluidas", value: completed},
        {name: "Pendentes", value: total - completed}
    ]

    const COLORS = ["#34D933", "#F87171"]

    return(
        <div className="flex flex-col items-center mt-6">
            <h2 className="text-xl font-semibold mb-2">Progresso das Tarefas</h2>
            <PieChart width={200} height={200}>
                <Pie data={data} cx="50%" cy="50%" outerRadius={80} fill="#8884d8" dataKey="value">
                    {data.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index]} />
                    ))}
                </Pie>
                <Tooltip />
            </PieChart>
        </div>
    )
}