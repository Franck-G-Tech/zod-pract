import { Todo } from "@/schemas/todo.schema";
import { TodoItem } from "./TodoItem";
import { Id } from "../../convex/_generated/dataModel";

interface TodoListProps {
    todos: Todo[];
    onToggle: (id: Id<"task">) => void;
    onDelete: (id: Id<"task">) => void;
}

export const TodoList: React.FC<TodoListProps> = ({ todos, onToggle, onDelete }) => {
    if (todos.length === 0) {
        return <p className="text-center text-gray-800">No hay tareas pendientes.</p>;
    }

    return (
        <ul className="space-y-2">
            {todos.map((todo) => (
                <TodoItem
                    key={todo._id}
                    todo={todo}
                    onToggle={onToggle}
                    onDelete={onDelete}
                />
            ))}
        </ul>
    );
};