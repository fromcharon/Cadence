import { useState,} from 'react';
import EditHabitForm from './EditHabitForm';
import { Trash2, CheckCircle, Pencil } from 'lucide-react'

function HabitItem(props){
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [showEdit, setShowEdit] = useState(false);

    async function handleDelete() {
        try {
            if (confirmDelete) {
                await fetch(`${process.env.REACT_APP_API_URL}/habits/${props.habit.id}`, {
                    method: 'DELETE',
                    credentials: 'include'
                })
                props.onHabitChange();
            }
            else{
                setConfirmDelete(true);
            }
        }
        catch (err) {
            console.error(err)
        }
    }

    async function handleMarkComplete() {
        try {
            await fetch(`${process.env.REACT_APP_API_URL}/habits/${props.habit.id}/complete`, {
                method: 'POST',
                credentials: 'include'
            })
            props.onHabitChange();
        }
        catch (err) {
            console.error(err)
    }
}

    return (
        <div className={`habit-card box-shadow ${showEdit ? 'habit-card-editing' : ''}`}>
            {showEdit ? 
            <div>
                <EditHabitForm habit={props.habit} onSave={props.onHabitChange} onClose={() => setShowEdit(false)}/>
            </div> : 
            <>
                <div className="habit-header">
                    <p className="habit-name">{props.habit.name}</p>
                    <p className="habit-description">{props.habit.description}</p>
                    <span className="streak-badge">🔥{props.habit.streak}</span>
                </div>
                <div className="habit-actions">
                    <button onClick={handleMarkComplete} className="btn-icon success"><CheckCircle size={16}/></button>
                    <button onClick={() => setShowEdit(true)} className="btn-icon edit"><Pencil size={16}/></button>
                    {confirmDelete 
                        ? <>
                            <button onClick={handleDelete} className="btn-icon danger">Confirm</button>
                            <button onClick={() => setConfirmDelete(false)} className="btn-icon">Cancel</button>
                        </>
                        : <button onClick={handleDelete} className="btn-icon danger"><Trash2 size={16}/></button>
                    }
                </div>
            </>}
        </div>
    )
}

export default HabitItem;