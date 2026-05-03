import { useState,} from 'react';

function EditHabitForm(props){
    const [newName, setNewName] = useState(props.habit.name);
    const [newDescription, setNewDescription] = useState(props.habit.description);

    async function handleEdit() {
        try {
            await fetch(`${process.env.REACT_APP_API_URL}/habits/${props.habit.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({name: newName, description: newDescription})
            });
            // onSave loadhabits() from HabitList imported through HabitItem
            props.onSave();
            props.onClose();
        }
        catch (err) {
            console.error(err)
        }
    }
    return(
        <div className='edit-form'> 
            <div className='edit-input-wrapper'>
                <input value={newName} onChange={(event) => setNewName(event.target.value)} type="text" placeholder="Enter New Name" className="edit-input-glass"/>
            </div>
            <div className='edit-input-wrapper'>
                <input value={newDescription} onChange={(event) => setNewDescription(event.target.value)} type="text" placeholder="Enter New Description" className="edit-input-glass"/>
            </div>
            <div className='edit-actions'>
                <button onClick={handleEdit} className='btn-icon success'>Save</button>
                <button onClick={props.onClose} className='btn-ghost'>Cancel</button>
            </div>
        </div>
    )
}

export default EditHabitForm;