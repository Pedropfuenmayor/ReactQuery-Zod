import React, { useState, useRef } from "react";
import type { Todo } from "@prisma/client";
import { useGetTodos, useCreateTodos } from "../hooks/todos";
import { getRandomInt } from "../lib/randonNum";
import { z } from "zod";

export default function Home() {
  const [todo, setTodo] = useState("");
  const [error, setError] = useState("");
  const todos = useGetTodos();
  const createTodos = useCreateTodos();

  const todoInputChangeHandler = (event: React.FormEvent<HTMLInputElement>) => {
    setTodo(event.currentTarget.value);
    if(error !== ''){
      setError("")
    }
  };

  const handelSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const data = z
      .string()
      .min(5, { message: "Must be 5 or more characters long" })
      .safeParse(todo);

    if (!data.success) {
      const formatted = data.error.format()._errors.join(", ") || "";
      setError(formatted)
      return;
    }
    const newTodo: Todo = {
      id: getRandomInt(1, 100000),
      name: todo,
      done: false,
    };
    createTodos.mutate(newTodo);
    setTodo("");
  };

  return (
    <div className="w-full my-10">
      <div className="m-auto max-w-fit">
        <form onSubmit={handelSubmit} className="flex-col">
          <input
            value={todo}
            onChange={todoInputChangeHandler}
            className="block"
            type="text"
          />
          {error && error}
          <button className="block">Submit</button>
        </form>
      </div>
      <div className="mt-10 m-auto max-w-fit">
        {todos.isLoading && "Loading..."}
        {todos.error instanceof Error && todos.error.message}
        <ul>
          {todos.data?.map(({ name, id }) => (
            <li key={id}>{name}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
