import { useSortable } from '@dnd-kit/sortable';
import React, { useState } from 'react'
import { MdDeleteForever } from "react-icons/md";
import { CSS } from '@dnd-kit/utilities';

const TaskCard = ({ task, deleteTask, updateTask }) => {
  const [mouseIsOver, setMouseIsOver] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const { setNodeRef, attributes, listeners, transform, transition, isDragging } =
    useSortable({
      id: task.id,
      data: { type: "Task", task },
      disabled: editMode
    });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  }

  const toggleEditMode = () => {
    setEditMode((prev) => !prev);
    setMouseIsOver(false);
  }

  if (editMode) {
    return (
      <div ref={setNodeRef} style={style} {...listeners} {...attributes} className="flex flex-col items-center bg-white p-3 h-[100px] min-h-[100px] rounded-xl hover:ring-2 hover:ring-inset hover:ring-cyan-500 cursor-grab">
        <textarea
          className='h-[80%] font-[500] text-black w-full resize-none border-none rounded bg-transparent focus:outline-none'
          value={task.title}
          placeholder="Title"
          onBlur={toggleEditMode}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault(); // prevent new line
              toggleEditMode();
            }
          }}
          onChange={(e) =>
            updateTask(task.id, {
              title: e.target.value,
              description: task.description,
            })
          }
        />

        <textarea
          className='h-[80%] text-black/50 w-full resize-none border-none rounded bg-transparent focus:outline-none'
          value={task.description}
          placeholder="Description"
          onBlur={toggleEditMode}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              toggleEditMode();
            }
          }}
          onChange={(e) =>
            updateTask(task.id, {
              title: task.title,
              description: e.target.value,
            })
          }
        />
      </div>
    );
  }

  if (isDragging) {
    return (
      <div
        className='opacity-30 text-white bg-[#333333] p-2.5 h-[100px] min-h-[100px] items-center flex text-left rounded-xl border-2 border-cyan-500  cursor-grab relative'
      />
    )
  }

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes} onClick={toggleEditMode} className="flex items-center text-left bg-white p-3 h-[90px] min-h-[90px] rounded-xl hover:ring-2 hover:ring-inset hover:ring-cyan-500 cursor-grab relative"
      onMouseEnter={() => setMouseIsOver(true)} onMouseLeave={() => setMouseIsOver(false)}>
      <div className='flex flex-col gap-1'>
        <h1 className='font-[500]'>{task.title}</h1>
        <p className='text-[14px] font-[500] text-black/50'>{task.description}</p>
      </div>
      {mouseIsOver && (
        <button onClick={() => deleteTask(task.id)} className='absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded hover:bg-red-300/20'><MdDeleteForever className="text-2xl text-red-500" /></button>
      )}
    </div>
  )
}

export default TaskCard;
