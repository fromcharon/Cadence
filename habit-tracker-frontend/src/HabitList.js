import { useState, useEffect } from 'react';
import CreateHabitForm from './CreateHabitForm';
import HabitItem from './HabitItem';

function HabitList(props) {
    const [habits, setHabits] = useState([]);
    async function loadHabits(){
    try{
        const response = await fetch(`${process.env.REACT_APP_API_URL}/habits`, {
            credentials: 'include'
        });
        const habitData = await response.json();
        setHabits(habitData);
    }
    catch(err) {
        console.error(err);
    }}

    useEffect(() => {
    loadHabits();
    
}, []);
    
    return (
        <div className="app-container">
            <div className="main-layout">
                <CreateHabitForm onHabitAdded={loadHabits} />
                <div className="habits-column">
                    <h3 className='box-shadow'>My Habits</h3>
                    {habits.length === 0 ? 
                        <div> Empty List </div> 
                        :
                        habits.map(habit => (
                            <HabitItem key={habit.id} habit={habit} onHabitChange={loadHabits} />
                        ))
                    }
                </div>
            </div>
        </div>
    )
}

export default HabitList;