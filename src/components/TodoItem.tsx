import { Todo } from "@/schemas/todo.schema";
import { Id } from "../../convex/_generated/dataModel";

interface TodoItemProps {
    todo: Todo;
    onToggle: (id: Id<"task">) => void;
    onDelete: (id: Id<"task">) => void;
}

export const TodoItem: React.FC<TodoItemProps> = ({ todo, onToggle, onDelete }) => {
    return (
        <li className="flex items-center justify-between p-2 border-b">
            <div className="flex items-center gap-2">
                <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => onToggle(todo._id)}
                    className="w-5 h-5 cursor-pointer"
                />
                <span className={`text-lg ${todo.completed ? "line-through text-gray-500" : "text-gray-800"}`}>
                    {todo.title}
                </span>
            </div>
            <button
                onClick={() => onDelete(todo._id)}
                className="text-red-500 hover:text-red-700"
            >
                Eliminar
            </button>
        </li>
    );
};