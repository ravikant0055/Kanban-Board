import React, { useMemo } from 'react'
import { SortableContext, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import TaskCard from './TaskCard';

const ColumnContainer = ({ column, tasks, deleteTask, updateTask }) => {

  const taskIds = useMemo(() => {
    return tasks.map((task) => task.id);
  }, [tasks]);

  const { setNodeRef, transform, transition } =
    useSortable({
      id: column.id,
      data: { type: "Column", column },
    });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  }

  return (
    <div ref={setNodeRef} style={style} className='flex flex-col gap-4 w-[350px] h-[500px] max-h-[500px] rounded-md'>
      {/* column title */}
      <div className={`border-b border-gray-300 pb-4 mb-2 ${column.id != 1 ? "px-7" : ""} `}>
        <div className="px-3 py-1 rounded-md text-[12px] font-[500] w-fit" style={{ backgroundColor: column.bgcolor }}>{column.title}</div>
      </div>

      {/* column task */}
      <div className={`flex flex-grow flex-col gap-4 overflow-x-hidden overflow-y-auto ${column.id != 1 ? "px-7" : "pr-7"}`}>
        <SortableContext items={taskIds}>
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} deleteTask={deleteTask} updateTask={updateTask} />
          ))}
        </SortableContext>
      </div>
    </div>
  )
}

export default ColumnContainer;