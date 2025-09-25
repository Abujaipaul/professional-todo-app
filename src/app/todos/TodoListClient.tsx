
'use client';

import { useState, useMemo, useTransition } from 'react';
import Link from 'next/link';
import { Modal } from '@/components/Modal';
import styles from './index.module.css';
import { SimpleTodo, addTodo } from './actions';

function CreateTodoForm({ onClose }: { onClose: () => void }) {
  const [isPending, startTransition] = useTransition();

  const handleFormAction = (formData: FormData) => {
    startTransition(async () => {
      const result = await addTodo(formData);
      if (result?.error) {
        alert(result.error);
      } else {
        onClose();
      }
    });
  };

  return (
    <form action={handleFormAction} className={styles.createForm}>
      <h2>Create New Todo</h2>
      <input
        type="text" name="title"
        placeholder="What needs to be done?" className={styles.createInput} autoFocus required
      />
      <button type="submit" disabled={isPending} className={styles.createButton}>
        {isPending ? 'Adding...' : 'Add Todo'}
      </button>
    </form>
  );
}


export default function TodoListClient({ initialTodos }: { initialTodos: SimpleTodo[] }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'completed' | 'incomplete'>('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);


  const todos = initialTodos;

  const filteredTodos = useMemo(() => {
    // The filter logic remains the same.
    return todos
      .filter((todo) => {
        if (filterStatus === 'all') return true;
        if (filterStatus === 'completed') return todo.completed;
        if (filterStatus === 'incomplete') return !todo.completed;
        return true;
      })
      .filter((todo) => {
        return todo.title.toLowerCase().includes(searchTerm.toLowerCase());
      });
  }, [todos, filterStatus, searchTerm]);

  const ITEMS_PER_PAGE = 10;
  const totalPages = Math.ceil(filteredTodos.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentTodos = filteredTodos.slice(startIndex, endIndex);

  return (
    <div>
      <div className={styles.mainHeader}>
        <h1 className={styles.pageTitle}>My Todos</h1>
        <button onClick={() => setIsCreateModalOpen(true)} className={styles.openCreateModalButton}>
          + New Todo
        </button>
      </div>

      <div className={styles.filterControls}>
        <input
          type="search" placeholder="Search by title..." value={searchTerm}
          onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
          className={styles.searchInput}
        />
        <div className={styles.filterButtons}>
          <button onClick={() => { setFilterStatus('all'); setCurrentPage(1); }} className={filterStatus === 'all' ? styles.activeFilter : ''}>All</button>
          <button onClick={() => { setFilterStatus('completed'); setCurrentPage(1); }} className={filterStatus === 'completed' ? styles.activeFilter : ''}>Completed</button>
          <button onClick={() => { setFilterStatus('incomplete'); setCurrentPage(1); }} className={filterStatus === 'incomplete' ? styles.activeFilter : ''}>Incomplete</button>
        </div>
      </div>

      <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)}>
        <CreateTodoForm onClose={() => setIsCreateModalOpen(false)} />
      </Modal>

      {/* Simplified loading/empty states */}
      {filteredTodos.length === 0 && (
        <p style={{ textAlign: 'center', marginTop: '2rem' }}>No todos match your criteria.</p>
      )}

      {currentTodos.length > 0 && (
        <>
          <ul className={styles.todoList}>
            {currentTodos.map((todo) => (
              <li key={todo.id}>
                <Link href={`/todos/${todo.id}`} className={styles.todoItemLink}>
                  <span>{todo.title}</span>
                  <span className={todo.completed ? styles.completedBadge : styles.pendingBadge}>
                    {todo.completed ? 'COMPLETED' : 'PENDING'}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <div className={styles.paginationControls}>
            <button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1}>Previous</button>
            <span>Page {currentPage} of {totalPages}</span>
            <button onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages}>Next</button>
          </div>
        </>
      )}
    </div>
  );
}