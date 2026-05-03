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

    async function handleLogout() {
        try{
            const response = await fetch(`${process.env.REACT_APP_API_URL}/logout`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            });

        //sets the SetLoginState to false, changes to auth view.
        props.onLogout(false);
    }   
    catch (err) {
        console.error("Unable to Log-out")
    } 
    }
    
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