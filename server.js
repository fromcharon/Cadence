require('dotenv').config();

const express = require("express");
const bcrypt = require("bcrypt");
const session = require("express-session");
const { Pool } = require('pg');
const pgSession = require('connect-pg-simple')(session);

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

pool.query("SELECT NOW()", (err, res) => {
    if (err) {
        console.log("Database connection failed:", err);
    } 
    else {
        console.log("Database connected at:", res.rows[0].now);
    }
});

const allowedOrigins = [
    'https://cadence-brown.vercel.app',
    'http://localhost:3001',
    'http://localhost:3000'
]

function allowControl(req, res, next) {
     const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
        }
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Expose-Headers', 'Set-Cookie');
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
}
next()
}

const app = express();
const PORT = 3000;
app.set('trust proxy', 1);
app.use(express.json());
app.use(allowControl);
app.use(session({
  store: new pgSession({
    pool: pool,
    tableName: 'session'
  }),
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { 
  secure: process.env.NODE_ENV === 'production',  // true on Render, false on localhost
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  maxAge: 30*24*60*60*1000 
}
}))



app.get('/habits/today', async (req, res) => {
  if (!req.session.userId) return res.status(401).json({ error: 'Not logged in' });

  try {
    const result = await pool.query(`
      SELECT 
        h.id,
        h.name,
        h.streak,
        CASE 
          WHEN c.id IS NOT NULL THEN true 
          ELSE false 
        END as completed_today
      FROM habits h
      LEFT JOIN completions c 
        ON c.habit_id = h.id 
        AND c.completed_date = CURRENT_DATE
      WHERE h.user_id = $1
    `, [req.session.userId]);

    res.json(result.rows);
  } catch(err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get("/habits", async (req, res) => {
    if (!req.session.userId) {
    return res.status(401).json({ error: "Not logged in" });
}
    try {
        const result = await pool.query("SELECT * FROM habits WHERE user_id = $1 ORDER BY id ASC", [req.session.userId]);
        res.json(result.rows);
    }
    catch (err) {
        res.status(500).json({error: "Database Issue"});
    }
});

app.post("/habits", async (req, res) => {
    if (!req.session.userId) {
        return res.status(401).json({ error: "Not logged in" });
}
    console.log('body received', req.body);
    const name = req.body.name;
    const description = req.body.description || "";

    if (!name || name.trim() === "") {
         return res.status(400).json({ error: "Habit name is required" });
}
    try {
        const result = await pool.query(
            "INSERT INTO habits (name, description, user_id) VALUES ($1, $2, $3) RETURNING *",
            [name.trim(), description.trim(), req.session.userId]
    );
        res.status(201).json(result.rows[0]);
    }
    catch (err) {
        res.status(500).json({error: "Database Issue"});
    }
});

app.delete("/habits/:id", async (req, res) => {
    if (!req.session.userId) {
    return res.status(401).json({ error: "Not logged-in" });
}
    const id = parseInt(req.params.id);
    console.log("Deleting habit with id:", id);

    try {
        const result = await pool.query (
            "DELETE FROM habits WHERE id = $1 AND user_id = $2 RETURNING *",
            [id, req.session.userId]
        );

        if (result.rows.length === 0) {
                return res.status(404).json({ error: "ID not found" });
            }

        res.status(200).json({message: "Habit Deleted!"});
    }
    catch (err) {
        console.log("Delete error:", err.message);
        res.status(500).json({error: "Database Issue"});
    }  
            
});

app.put("/habits/:id", async(req, res) => {
    if (!req.session.userId) {
    return res.status(401).json({ error: "Not logged-in" });
}
    const id = parseInt(req.params.id);
    const newName = req.body.name;

    if (!newName || newName.trim() === "") {
        return res.status(400).json({ error: "Habit name is required" });
    }

    const newDes = req.body.description || "";

    try{
        const result = await pool.query(
            "UPDATE habits SET name = $1, description = $2 WHERE id = $3 AND user_id = $4 RETURNING *",
        [newName.trim(), newDes.trim(), id, req.session.userId]
        );

        if (result.rows.length === 0) {
                return res.status(404).json({error: "ID not Found"});
            };

        res.status(201).json(result.rows);
     }

     catch (err) {
        res.status(500).json({error: "DataBase Issue"});
     }
});

app.post("/habits/:id/complete", async (req, res) => {
    if (!req.session.userId) {
    return res.status(401).json({ error: "Not logged-in" });
}
    const id = parseInt(req.params.id);
    const date = new Date().toISOString().split('T')[0];
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayString = yesterday.toISOString().split('T')[0];

    try {
        const result = await pool.query(
            "SELECT * FROM habits WHERE id = $1 AND user_id = $2",
        [id, req.session.userId]
        );

        if (result.rows.length === 0) return res.status(404).json({error: "Id not Found!"});

        const habit = result.rows[0];
        const currentStreak = habit.streak;

        const completionCheck = await pool.query(
            "SELECT * FROM completions WHERE habit_id = $1 AND completed_date = $2",
                [id, date]
        );
        if (completionCheck.rows.length > 0) return res.status(400).json({ error: "Habit Already completed today!" });

        await pool.query(
            "INSERT INTO completions (habit_id, completed_date) VALUES ($1, $2)",
                [id, date]
        );

        const yesterdayCheck = await pool.query(
            "SELECT * FROM completions WHERE habit_id = $1 AND completed_date = $2",
                [id, yesterdayString]
        );

        if (yesterdayCheck.rows.length === 0) {
            await pool.query (
                "UPDATE habits SET streak = $1 WHERE id = $2 AND user_id = $3",
                [1, id, req.session.userId]
            );
        }

        else {
            await pool.query (
                "UPDATE habits SET streak = $1 WHERE id = $2 AND user_id = $3",
                    [currentStreak + 1, id, req.session.userId]
            )
        }

        res.status(201).json({message: "Streak has been updated"});
    }
    
    catch (err) {
        res.status(500).json({ error: "Database Error" });
    }                       
    
});


app.post("/register", async (req, res) => {
    const email = req.body.email.trim().toLowerCase();
    const userName = req.body.userName.trim();
    const password = req.body.password.trim();

    if (!email) {
        return res.status(400).json({ error: "A Valid Email is required!" });
}
    if (!email.includes('@')) {
        return res.status(400).json({error: "Email is Incorrect!"})
}
    if (!userName) {
        return res.status(400).json({error: "Username is required!"})
}
    if (!password) {
        return res.status(400).json({error: "Password is required!"})
}
    if (password.length < 8) {
        return res.status(400).json({error: "Password should be atleast 8 characters long!"})
}
    try{
        const result = await pool.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
    )
        if (result.rows.length === 0) {
            const saltRounds = 10;
            const hashPassword = await bcrypt.hash(password, saltRounds);
            
            await pool.query(
                "INSERT INTO users (email, username, password) VALUES ($1, $2, $3)",
                [email, userName, hashPassword]
            );

            const newUser = await pool.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
);  

            req.session.regenerate((err) => {
                if (err) return res.status(500).json({ error: 'Session error' });
                req.session.userId = newUser.rows[0].id;
                req.session.save((err) => {
                    if (err) return res.status(500).json({ error: 'Session save failed' });
                    res.status(201).json({ message: 'Registration Successful!' });
                });
            });
        }
        
        else res.status(400).json({ error: "Already Registered!" });
    }
        
    catch (err) {
        res.status(500).json({error: "Server Issue!"});
    }
});

app.post("/login", async (req, res) => {
    const email = req.body.email.trim().toLowerCase();
    const password = req.body.password.trim();

    if (!email.includes('@')) {
        return res.status(400).json({error: "Email is Incorrect!"})
    }

    try{
        const result = await pool.query(
        "SELECT * FROM users WHERE email = $1",
        [email]
    )
        if (result.rows.length > 0) {
            const userData = result.rows[0];
            const match = await bcrypt.compare(password, userData.password);

            if (match) {
                req.session.regenerate((err) => {
                if (err) return res.status(500).json({ error: 'Session error' });
                req.session.userId = userData.id;
                req.session.save((err) => {
                    if (err) return res.status(500).json({ error: 'Session save failed' });
                    res.json({ message: 'Login successful' });
                });
});
            }
            if (!match) {
                return res.status(400).json({error: "Password is incorrect!"})
            }  
        }
        else {
            return res.status(400).json({error: "Email not registered!"})
        }
}
    catch(err) {
        res.status(500).json({error: "Server Issue!"});
    }   

})

// app.get("/me", (req, res) => {
//     res.json({ userId: req.session.userId });
// });

app.get("/auth/check", (req, res) => {
    const userId = req.session.userId;
    if (req.session.userId) {
        return res.status(200).json(userId);
    }
    else {
        return res.status(401).json({error: "Lacks valid credentials"});
    }
})

app.post("/logout", async (req,res) => {
    const userId = req.session.userId;
    
    try{
        if (!req.session.userId) return res.status(401).json({error: "Not Logged in, Log-out will not work"});
        
            req.session.destroy((err) => {
                if (err) return res.status(500).json({error: 'Server Error!'});

                res.clearCookie('connect.sid');
                return res.status(200).json({message: 'Log-out Successful'});
            })
    }
    catch(err) {
        res.status(500).json({error: 'Server Error!'});
    }
    
})

app.get("/profileinfo", async(req, res) => {
    if (!req.session.userId) {
    return res.status(401).json({ error: "Not logged-in" });
}
    try {
        const result = await pool.query (
            "SELECT * FROM users WHERE id = $1",
            [req.session.userId]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }
        const data = result.rows[0]
        return res.status(200).json(data);
    }
    catch (err) {
        res.status(500).json({error: "Database Issue"});
    } 
})






app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});