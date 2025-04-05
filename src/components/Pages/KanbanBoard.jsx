import React, { useState } from 'react'
import { Button } from '../ui/button';
import ColumnContainer from './ColumnContainer';

const KanbanBoard = () => {
  const [columns, setColumns] = useState([]);

  const createNewColumn = () => {
    const columnToAdd  = {
        id: generateId(),
        title : `Column ${columns.length + 1}`
    };
    setColumns([...columns, columnToAdd])
  }
  
  const generateId = () => {
    return Math.floor(Math.random() * 10001);
  }
  console.log(columns);
  

  return (
    <div className='m-auto flex min-h-screen w-full items-center overflow-x-auto overflow-y-hidden px-[40px]'>
        <div className='m-auto flex gap-2'>
           <div className='flex gap-4'>
              {columns.map((col)=>{
                <ColumnContainer column={col}/>
              })}
           </div>
           <Button onClick={()=>createNewColumn()}>Add Column</Button>
        </div>
    </div>
  )
}

export default KanbanBoard;