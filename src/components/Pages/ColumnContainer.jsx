import React from 'react'

const ColumnContainer = ({column}) => {
  return (
    <div className='bg-columnBackgroundColor w-[350px] h-[500px] max-h-[500px] rounded-md flex flex-col'>
        <div>{column.title}</div>
        <div className='flex flex-grow'>Content</div>
        <div>Footer</div>
    </div>
  )
}

export default ColumnContainer;