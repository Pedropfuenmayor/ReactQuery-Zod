import { useQuery, useQueryClient, useMutation} from "@tanstack/react-query";
import axios from "axios";
import type { Todo } from "../models";

async function getTodos(): Promise<Todo[]> {
  const res = await axios.get("/api/todos");
  return res.data;
}

export function useGetTodos() {
  return useQuery(["todos"], getTodos);
}

async function postTodo(todo: Todo): Promise<Todo> {
  const res = await axios.post("/api/todos", todo);
  return res.data;
}

// Mutate user and update it optimistically
export function useCreateTodos() {
  const queryClient = useQueryClient();
  return useMutation(postTodo, {
    onMutate: async (newTodo: Todo) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries(["todos"]);

      // Snapshot the previous value
      const previousTodos = queryClient.getQueryData<Todo[]>(["todos"]);

      // Optimistically update to the new value
      if (previousTodos) {
        queryClient.setQueryData<Todo[]>(
          ["todos"],
          [...previousTodos, newTodo]
        );
      }
      return { previousTodos };
    },
    // If the mutation fails, use the context returned from onMutate to roll back
    onError: (err, variables, context) => {
      if (context?.previousTodos) {
        queryClient.setQueryData<Todo[]>(["todos"], context.previousTodos);
      }
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(["todos"]);
    },
  });
}


