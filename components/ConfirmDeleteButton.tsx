'use client';
export default function ConfirmDeleteButton({action}:{action:()=>void}){return <button type='button' onClick={()=>confirm('Delete?')&&action()} className='text-red-400'>Delete</button>}
