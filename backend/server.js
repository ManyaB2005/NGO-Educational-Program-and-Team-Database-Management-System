const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const db = require("./db"); // Make sure your db.js path is correct
const path = require("path");

const app = express();
app.use(cors());
app.use(bodyParser.json());
// Assuming public folder contains all HTML, CSS, JS frontend files
app.use(express.static(path.join(__dirname, "../public"))); 

app.get("/", (req, res) => {
    // This assumes index.html is your login page
    res.sendFile(path.join(__dirname, "../public/index.html"));
});

// =======================================================
//                   CRUD ENDPOINTS
// =======================================================

// --- Member ---
app.post("/addMember", (req, res) => {
    const { Member_ID, First_Name, Middle_Name, Last_Name, Contact, Email, DOB, Age, Team_ID } = req.body;
    const sql = `
      INSERT INTO Member 
      (Member_ID, First_Name, Middle_Name, Last_Name, Contact, Email, DOB, Age, Team_ID)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    db.query(sql, [Member_ID, First_Name, Middle_Name, Last_Name, Contact, Email, DOB, Age, Team_ID], (err) => {
        if(err) return res.status(500).send({ error: err });
        res.send("Member added!");
    });
});
app.get("/members", (req, res) => {
    db.query("SELECT * FROM Member", (err, rows) => {
        if(err) res.status(500).send({ error: err });
        else res.json(rows); 
    });
});
app.put("/updateMember/:id", (req, res) => {
    const { First_Name, Middle_Name, Last_Name, Contact, Email, DOB, Age, Team_ID } = req.body;
    const sql = `
        UPDATE Member SET
        First_Name=?, Middle_Name=?, Last_Name=?, Contact=?, Email=?, DOB=?, Age=?, Team_ID=?
        WHERE Member_ID=?
    `;
    db.query(sql, [First_Name, Middle_Name, Last_Name, Contact, Email, DOB, Age, Team_ID, req.params.id], (err) => {
        if(err) return res.status(500).send({ error: err });
        res.send("Member updated!");
    });
});
app.delete("/deleteMember/:id", (req, res) => { db.query("DELETE FROM Member WHERE Member_ID=?", [req.params.id], (err) => { if(err) res.status(500).send({ error: err }); else res.send("Member deleted!"); }); });

// --- Teams ---
app.post("/addTeam", (req, res) => {
    const { Team_ID, Team_Name, Team_Size } = req.body;
    db.query("INSERT INTO Teams (Team_ID, Team_Name, Team_Size) VALUES (?, ?, ?)", [Team_ID, Team_Name, Team_Size], (err)=>{ if(err) res.status(500).send({ error: err }); else res.send("Team added!"); });
});
app.get("/teams", (req, res) => { db.query("SELECT * FROM Teams", (err, rows)=>{ if(err) res.status(500).send({ error: err }); else res.json(rows); }); });
app.put("/updateTeam/:id", (req, res) => {
    const { Team_Name, Team_Size } = req.body;
    db.query("UPDATE Teams SET Team_Name=?, Team_Size=? WHERE Team_ID=?", [Team_Name, Team_Size, req.params.id], (err) => {
        if(err) return res.status(500).send({ error: err });
        res.send("Team updated!");
    });
});
app.delete("/deleteTeam/:id", (req, res) => { db.query("DELETE FROM Teams WHERE Team_ID=?", [req.params.id], (err)=>{ if(err) res.status(500).send({ error: err }); else res.send("Team deleted!"); }); });

// --- Education ---
app.post("/addEducation", (req, res) => {
    const { USN, Degree, Institution_Name, Field_of_Study } = req.body;
    db.query("INSERT INTO Education (USN, Degree, Institution_Name, Field_of_Study) VALUES (?, ?, ?, ?)", [USN, Degree, Institution_Name, Field_of_Study], (err)=>{ if(err) res.status(500).send({ error: err }); else res.send("Education added!"); });
});
app.get("/education", (req, res) => { db.query("SELECT * FROM Education", (err, rows)=>{ if(err) res.status(500).send({ error: err }); else res.json(rows); }); });
app.put("/updateEducation/:usn", (req, res) => {
    const { Degree, Institution_Name, Field_of_Study } = req.body;
    db.query("UPDATE Education SET Degree=?, Institution_Name=?, Field_of_Study=? WHERE USN=?", [Degree, Institution_Name, Field_of_Study, req.params.usn], (err) => {
        if(err) return res.status(500).send({ error: err });
        res.send("Education updated!");
    });
});
app.delete("/deleteEducation/:usn", (req, res) => { db.query("DELETE FROM Education WHERE USN=?", [req.params.usn], (err)=>{ if(err) res.status(500).send({ error: err }); else res.send("Education deleted!"); }); });

// --- Member_Education ---
app.post("/addMemberEducation", (req, res) => {
    const { USN, Member_ID } = req.body;
    db.query("INSERT INTO Member_Education (USN, Member_ID) VALUES (?, ?)", [USN, Member_ID], (err)=>{ if(err) res.status(500).send({ error: err }); else res.send("Member_Education added!"); });
});
app.get("/member_education", (req, res) => { db.query("SELECT * FROM Member_Education", (err, rows)=>{ if(err) res.status(500).send({ error: err }); else res.json(rows); }); });
app.put("/updateMemberEducation/:usn/:id", (req, res) => {
    const { new_USN, new_Member_ID } = req.body;
    db.query("UPDATE Member_Education SET USN=?, Member_ID=? WHERE USN=? AND Member_ID=?", [new_USN, new_Member_ID, req.params.usn, req.params.id], (err) => {
        if(err) return res.status(500).send({ error: err });
        res.send("Member_Education updated!");
    });
});
app.delete("/deleteMemberEducation/:usn/:id", (req, res) => { db.query("DELETE FROM Member_Education WHERE USN=? AND Member_ID=?", [req.params.usn, req.params.id], (err)=>{ if(err) res.status(500).send({ error: err }); else res.send("Member_Education deleted!"); }); });

// --- Education_Skills ---
app.post("/addEducationSkill", (req, res) => {
    const { USN, Skill_Name, Skill_Type } = req.body;
    db.query("INSERT INTO Education_Skills (USN, Skill_Name, Skill_Type) VALUES (?, ?, ?)", [USN, Skill_Name, Skill_Type], (err)=>{ if(err) res.status(500).send({ error: err }); else res.send("Skill added!"); });
});
app.get("/education_skills", (req, res) => { db.query("SELECT * FROM Education_Skills", (err, rows)=>{ if(err) res.status(500).send({ error: err }); else res.json(rows); }); });
app.put("/updateEducationSkill/:usn/:skill", (req, res) => {
    const { Skill_Type } = req.body;
    db.query("UPDATE Education_Skills SET Skill_Type=? WHERE USN=? AND Skill_Name=?", [Skill_Type, req.params.usn, req.params.skill], (err) => {
        if(err) return res.status(500).send({ error: err });
        res.send("Skill updated!");
    });
});
app.delete("/deleteEducationSkill/:usn/:skill", (req, res) => { db.query("DELETE FROM Education_Skills WHERE USN=? AND Skill_Name=?", [req.params.usn, req.params.skill], (err)=>{ if(err) res.status(500).send({ error: err }); else res.send("Skill deleted!"); }); });

// --- Sessions ---
app.post("/addSession", (req, res) => {
    const { Session_ID, Session_Name, Session_Date, Session_Duration, Mode_of_Session, Member_ID } = req.body;
    const sql = `
        INSERT INTO Session_Table 
        (Session_ID, Session_Name, Session_Date, Session_Duration, Mode_of_Session, Member_ID)
        VALUES (?, ?, ?, ?, ?, ?)
    `;
    db.query(sql, [Session_ID, Session_Name, Session_Date, Session_Duration, Mode_of_Session, Member_ID], (err) => {
        if(err) return res.status(500).send({ error: err });
        res.send({ message: "Session added successfully!" });
    });
});
app.get("/sessions", (req, res) => {
    db.query(`
        SELECT s.Session_ID, s.Session_Name, s.Session_Date, s.Session_Duration, s.Mode_of_Session, m.Member_ID, m.First_Name
        FROM Session_Table s
        LEFT JOIN Member m ON s.Member_ID = m.Member_ID
    `, (err, rows) => {
        if(err) return res.status(500).send({ error: err });
        res.json(rows);
    });
});
app.put("/updateSession/:id", (req, res) => {
    const { Session_Name, Session_Date, Session_Duration, Mode_of_Session, Member_ID } = req.body;
    const sql = `
        UPDATE Session_Table SET
        Session_Name=?, Session_Date=?, Session_Duration=?, Mode_of_Session=?, Member_ID=?
        WHERE Session_ID=?
    `;
    db.query(sql, [Session_Name, Session_Date, Session_Duration, Mode_of_Session, Member_ID, req.params.id], (err) => {
        if(err) return res.status(500).send({ error: err });
        res.send({ message: "Session updated!" });
    });
});
app.delete("/deleteSession/:id", (req, res) => {
    db.query("DELETE FROM Session_Table WHERE Session_ID=?", [req.params.id], (err) => {
        if(err) return res.status(500).send({ error: err });
        res.send({ message: "Session deleted!" });
    });
});

// --- Events ---
app.post("/addEvent", (req, res) => {
    const { Event_ID, Event_Name, Event_Date, Event_Duration, Event_Location, Number_of_Participants, Team_ID } = req.body;
    db.query("INSERT INTO Events (Event_ID, Event_Name, Event_Date, Event_Duration, Event_Location, Number_of_Participants, Team_ID) VALUES (?, ?, ?, ?, ?, ?, ?)", [Event_ID, Event_Name, Event_Date, Event_Duration, Event_Location, Number_of_Participants, Team_ID], (err)=>{ if(err) res.status(500).send({ error: err }); else res.send("Event added!"); });
});
app.get("/events", (req, res) => { db.query("SELECT * FROM Events", (err, rows)=>{ if(err) res.status(500).send({ error: err }); else res.json(rows); }); });
app.put("/updateEvent/:id", (req, res) => {
    const { Event_Name, Event_Date, Event_Duration, Event_Location, Number_of_Participants, Team_ID } = req.body;
    db.query("UPDATE Events SET Event_Name=?, Event_Date=?, Event_Duration=?, Event_Location=?, Number_of_Participants=?, Team_ID=? WHERE Event_ID=?", [Event_Name, Event_Date, Event_Duration, Event_Location, Number_of_Participants, Team_ID, req.params.id], (err) => {
        if(err) return res.status(500).send({ error: err });
        res.send("Event updated!");
    });
});
app.delete("/deleteEvent/:id", (req, res) => { db.query("DELETE FROM Events WHERE Event_ID=?", [req.params.id], (err)=>{ if(err) res.status(500).send({ error: err }); else res.send("Event deleted!"); }); });


// =======================================================
//                 DYNAMIC STATS ENDPOINTS
// =======================================================

// 1. Total Members Count
app.get("/stats/total-members", (req, res) => {
    db.query("SELECT COUNT(Member_ID) AS Total FROM Member", (err, rows) => {
        if (err) return res.status(500).send({ error: err });
        res.json(rows[0]);
    });
});

// 2. Total Teams Count
app.get("/stats/total-teams", (req, res) => {
    db.query("SELECT COUNT(Team_ID) AS Total FROM Teams", (err, rows) => {
        if (err) return res.status(500).send({ error: err });
        res.json(rows[0]);
    });
});

// 3. Events Count for Current Month (Fixed for better compatibility)
app.get("/stats/monthly-events", (req, res) => {
    const sql = `
        SELECT COUNT(Event_ID) AS Total 
        FROM Events 
        WHERE DATE_FORMAT(Event_Date, '%Y-%m') = DATE_FORMAT(CURDATE(), '%Y-%m')
    `;
    db.query(sql, (err, rows) => {
        if (err) return res.status(500).send({ error: err });
        res.json(rows[0]);
    });
});

// 4. Upcoming Sessions Count (in the future)
app.get("/stats/upcoming-sessions", (req, res) => {
    const sql = `
        SELECT COUNT(Session_ID) AS Total 
        FROM Session_Table 
        WHERE Session_Date >= CURDATE()
    `;
    db.query(sql, (err, rows) => {
        if (err) return res.status(500).send({ error: err });
        res.json(rows[0]);
    });
});

// 5. Fetch data for Upcoming Activities Feed (next 5 sessions and events)
app.get("/stats/upcoming-activities-feed", (req, res) => {
    const sql = `
        (
            SELECT 
                'Session' AS Type, 
                Session_Name AS Name, 
                Session_Date AS Date, 
                m.First_Name AS Conductor
            FROM Session_Table s
            LEFT JOIN Member m ON s.Member_ID = m.Member_ID
            WHERE s.Session_Date >= CURDATE()
        )
        UNION ALL
        (
            SELECT 
                'Event' AS Type, 
                Event_Name AS Name, 
                Event_Date AS Date,
                NULL AS Conductor
            FROM Events
            WHERE Event_Date >= CURDATE()
        )
        ORDER BY Date
        LIMIT 5;
    `;
    db.query(sql, (err, rows) => {
        if (err) return res.status(500).send({ error: err });
        res.json(rows);
    });
});

// 6. Fetch data for Team Capacity Status (Total slots vs. Total members)
app.get("/stats/team-capacity", (req, res) => {
    const sql = `
        SELECT 
            IFNULL(SUM(t.Team_Size), 0) AS TotalCapacity, 
            COUNT(m.Member_ID) AS TotalMembers
        FROM Teams t
        LEFT JOIN Member m ON t.Team_ID = m.Team_ID;
    `;
    db.query(sql, (err, rows) => {
        if (err) return res.status(500).send({ error: err });
        res.json(rows[0]);
    });
});

// ---------------- QUERY DASHBOARD ENDPOINT ----------------

app.post("/runQuery", (req, res) => {
    const { query } = req.body;
    db.query(query, (err, rows) => {
        if(err) res.status(500).send({ error: err });
        else res.json(rows);
    });
});


app.listen(3000, () => console.log("🚀 Server running at http://localhost:3000"));