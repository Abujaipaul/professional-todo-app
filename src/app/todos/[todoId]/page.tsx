// src/app/todos/[todoId]/page.tsx
'use client';

import { useState, useEffect, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import styles from './todo-detail.module.css';
import { getTodoById, updateTodo, deleteTodo, SimpleTodo } from '../actions';

export default function TodoDetailPage({ params }: { params: { todoId: string } }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const todoId = Number(params.todoId);

  const [isEditing, setIsEditing] = useState(false);
  const [isPending, startTransition] = useTransition();
  
  const { data: todo, isLoading, isError } = useQuery<SimpleTodo | null>({
    queryKey: ['todos', todoId],
    queryFn: () => getTodoById(todoId),
  });
  
  const [editedTitle, setEditedTitle] = useState(todo?.title || '');
  const [editedCompleted, setEditedCompleted] = useState(todo?.completed || false);

  useEffect(() => {
    if (todo) {
      setEditedTitle(todo.title);
      setEditedCompleted(todo.completed);
    }
  }, [todo]);
  
  const handleUpdate = () => {
    if (!editedTitle.trim() || !todo) return;

    startTransition(async () => {
      const updatedTodoData = {
        id: todo.id,
        title: editedTitle,
        completed: editedCompleted,
      };
      
      const result = await updateTodo(updatedTodoData);
      
      if (result?.error) {
        alert(result.error);
      } else {
        // Optimistically update the cache for a smoother UI experience
        queryClient.setQueryData(['todos', todoId], updatedTodoData);
        // Invalidate the main list to ensure it's fresh when user navigates back
        queryClient.invalidateQueries({ queryKey: ['todos'] });
        setIsEditing(false);
      }
    });
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this todo?')) {
      startTransition(async () => {
        const result = await deleteTodo(todoId);
        if (result?.error) {
          alert(result.error);
        } else {
          // Invalidate the main list query
          queryClient.invalidateQueries({ queryKey: ['todos'] });
          router.push('/todos');
        }
      });
    }
  };

  if (isLoading) return <div>Loading todo details...</div>;
  if (isError) return <div className={styles.error}>Error fetching todo.</div>;
  if (!todo) return <div>Todo not found. <Link href="/todos">Go back</Link></div>;

  return (
    <div className={styles.container}>
      {isEditing ? (
        <div className={styles.editForm}>
          <input type="text" value={editedTitle} onChange={(e) => setEditedTitle(e.target.value)} className={styles.editInput} autoFocus />
          <label className={styles.editCheckboxLabel}>
            <input type="checkbox" checked={editedCompleted} onChange={(e) => setEditedCompleted(e.target.checked)} />
            Completed
          </label>
        </div>
      ) : (
        <>
          <h1 className={styles.title}>{todo.title}</h1>
          <div className={styles.detailsGrid}>
            <p><strong>ID:</strong> {todo.id}</p>
            <p><strong>Status:</strong>
              <span className={todo.completed ? styles.completed : styles.pending}>
                {todo.completed ? 'Completed' : 'Pending'}
              </span>
            </p>
          </div>
        </>
      )}
      <div className={styles.actions}>
        <Link href="/todos" className={styles.backButton}>&larr; Back</Link>
        {isEditing ? (
          <button onClick={handleUpdate} className={styles.saveButton} disabled={isPending}>
            {isPending ? 'Saving...' : 'Save'}
          </button>
        ) : (
          <button onClick={() => setIsEditing(true)} className={styles.editButton}>Edit</button>
        )}
        <button onClick={handleDelete} className={styles.deleteButton} disabled={isPending}>
          {isPending ? 'Deleting...' : 'Delete'}
        </button>
      </div>
    </div>
  );
}