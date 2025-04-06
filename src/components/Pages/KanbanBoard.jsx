import React, { useEffect, useMemo, useState } from 'react'
import { Button } from '../ui/button';
import { IoMdAdd } from "react-icons/io";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { createPortal } from 'react-dom';
import { DndContext, DragOverlay, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext } from '@dnd-kit/sortable';
import { Textarea } from '../ui/textarea';
import ColumnContainer from './ColumnContainer';
import TaskCard from './TaskCard';

const KanbanBoard = () => {
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem("kanbanTasks");
    return savedTasks ? JSON.parse(savedTasks) : [];
  });
  const [taskValue, setTaskValue] = useState({ title: '', description: '' });
  const [open, setOpen] = useState(false);
  const [activeTask, setActiveTask] = useState(null);


  useEffect(() => {
    localStorage.setItem("kanbanTasks", JSON.stringify(tasks));
  }, [tasks]);

  const columns = [
    { id: 1, title: "To do", bgcolor: "#f2cece" },
    { id: 2, title: "In Progress", bgcolor: "#e0cef2" },
    { id: 3, title: "Completed", bgcolor: "#cef2ce" },
  ]

  const ColumnIds = useMemo(() => {
      return columns.map((col) => col.id);
    }, [columns]);

  const sensors = useSensors(useSensor(PointerSensor, {
    activationConstraint: {
      distance: 3,
    },
  }));

  const createTask = () => {
    if (!taskValue.title.trim()) return;
    const newTask = {
      id: generateId(),
      columnId: 1,
      title: taskValue.title,
      description: taskValue.description
    };
    setTasks([...tasks, newTask]);
    setTaskValue({ title: '', description: '' });
    setOpen(false);
  }

  const deleteTask = (id) => {
    const newTask = tasks.filter((task) => task.id !== id);
    setTasks(newTask);
  }

  const updateTask = (id, updatedTask) => {
    const newTasks = tasks.map((task) => {
      if (task.id !== id) return task;
      return { ...task, ...updatedTask };
    });

    setTasks(newTasks);
  };

  const generateId = () => {
    return Math.floor(Math.random() * 10001);
  }

  const onDragStart = (e) => {
    if (e.active.data.current?.type === "Task") {
      setActiveTask(e.active.data.current.task);
      return;
    }
  }
  
  const onDragEnd = (e) => {
    setActiveTask(null);

    const { active, over } = e;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

  }

  const onDragOver = (e) => {
    const { active, over } = e;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveTask = active.data.current?.type === "Task";
    const isOverTask = over.data.current?.type === "Task";

    if (!isActiveTask) return;

    //dropping a Task over Another task
    if (isActiveTask && isOverTask) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId);
        const overIndex = tasks.findIndex((t) => t.id === overId);

        tasks[activeIndex].columnId = tasks[overIndex].columnId;
        return arrayMove(tasks, activeIndex, overIndex);
      });
    }

    const isOverColumn = over.data.current?.type === "Column";
    //dropping a Task over a column
    if (isActiveTask && isOverColumn) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId);
        tasks[activeIndex].columnId = overId;
        return arrayMove(tasks, activeIndex, activeIndex);
      });
    }
  }

  

  return (
    <div className='flex flex-col gap-10 items-center min-h-screen w-full items-start px-20 py-10 bg-[#f7f7f7]'>
      <div className="flex flex-col items-start gap-10">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#f66135] px-6 py-5 text-[14px]">Add Task<IoMdAdd /></Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add a New Task</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-2">
              <Label className="flex text-[12px] text-black/60 flex-col gap-2">
                Task Name
                <Input
                  value={taskValue.title}
                  onChange={(e) => setTaskValue({ ...taskValue, title: e.target.value })}
                  className="rounded-none text-black autofocus-none border-none bg-[#f8f8f8]"
                />
              </Label>
              <Label className="flex text-[12px] text-black/60  flex-col gap-2">
                Description
                <Textarea
                  value={taskValue.description}
                  onChange={(e) => setTaskValue({ ...taskValue, description: e.target.value })}
                  className="rounded-none text-black autofocus-none border-none resize-none h-32 max-h-48 bg-[#f8f8f8]"
                />
              </Label>
            </div>
            <DialogFooter>
              <Button className="bg-[#f66135] text-[14px] px-7 py-5" type="button" onClick={createTask}>Add Task</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <DndContext sensors={sensors} onDragStart={onDragStart} onDragOver={onDragOver} onDragEnd={onDragEnd}>

          <div className='flex divide-x divide-gray-300'>
            <SortableContext items={ColumnIds}>
              {columns.map((col) => (
                <ColumnContainer key={col.id} column={col} deleteTask={deleteTask} updateTask={updateTask}
                  tasks={tasks.filter((task) => task.columnId === col.id)}
                />
              ))}
            </SortableContext>
          </div>

          {createPortal(
            <DragOverlay>
              {activeTask && (
                <TaskCard
                  task={activeTask}
                  deleteTask={deleteTask}
                  updateTask={updateTask}
                />
              )}
            </DragOverlay>,
            document.body
          )}
        </DndContext>
      </div>
    </div>
  )
}

export default KanbanBoard;