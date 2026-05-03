import { useState, useEffect } from 'react';


function CreateHabitForm(props) {
    const [habitName, setHabitName] = useState('');
    const [habitDescription, setHabitDescription] = useState('');

    async function addHabit(){
    try {    
        const response = await fetch(`${process.env.REACT_APP_API_URL}/habits`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
        body: JSON.stringify({ name: habitName, description: habitDescription })
    });
    setHabitName('');
    setHabitDescription('');
    props.onHabitAdded();
    }
    catch (err) {
        console.error(err);
    }
    }
    
    return (
        <div>
            <div className="add-habit-card">
                <h2> Add Habits</h2>
                <div className="input-wrapper">
                    <input value={habitName} onChange={(event) => setHabitName(event.target.value)} type="text" placeholder="Enter Name" className='input-glass'/>
                </div>
                <div className="input-wrapper">
                    <input value={habitDescription} onChange={(event) => setHabitDescription(event.target.value)} type="text" placeholder="Enter Description" className='input-glass'/>
                </div>
                <button id='create-habit-save-btn' onClick={addHabit} className="btn-icon success">Save</button>
            </div>
        </div>
    )
}

export default CreateHabitForm;