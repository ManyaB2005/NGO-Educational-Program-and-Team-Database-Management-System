const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const db = require("./db");
const path = require("path");

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "../public")));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/login.html"));
});

/* ----------------------------------
   MEMBER
---------------------------------- */
app.post("/addMember", (req, res) => {
    const { Member_ID, First_Name, Middle_Name, Last_Name, Contact, Email, DOB, Age, Team_ID } = req.body;

    const sql = `
      INSERT INTO Member 
      (Member_ID, First_Name, Middle_Name, Last_Name, Contact, Email, DOB, Age, Team_ID)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(sql, [Member_ID, First_Name, Middle_Name, Last_Name, Contact, Email, DOB, Age, Team_ID], (err) => {
        if(err) return res.status(500).send(err);
        res.send("Member added!");
    });
});

app.get("/members", (req, res) => {
    db.query("SELECT * FROM Member", (err, rows) => {
        if(err) res.status(500).send(err);
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
        if(err) return res.status(500).send(err);
        res.send("Member updated!");
    });
});

app.delete("/deleteMember/:id", (req, res) => {
    db.query("DELETE FROM Member WHERE Member_ID=?", [req.params.id], (err) => {
        if(err) res.status(500).send(err);
        else res.send("Member deleted!");
    });
});

/* ----------------------------------
   TEAMS
---------------------------------- */
app.post("/addTeam", (req, res) => {
    const { Team_ID, Team_Name, Team_Size } = req.body;
    db.query("INSERT INTO Teams (Team_ID, Team_Name, Team_Size) VALUES (?, ?, ?)", 
        [Team_ID, Team_Name, Team_Size], 
        (err)=>{ if(err) res.status(500).send(err); else res.send("Team added!"); });
});

app.get("/teams", (req, res) => {
    db.query("SELECT * FROM Teams", (err, rows)=>{ 
        if(err) res.status(500).send(err); 
        else res.json(rows); 
    });
});

app.put("/updateTeam/:id", (req, res) => {
    const { Team_Name, Team_Size } = req.body;
    db.query("UPDATE Teams SET Team_Name=?, Team_Size=? WHERE Team_ID=?", 
        [Team_Name, Team_Size, req.params.id], 
        (err) => {
            if(err) return res.status(500).send(err);
            res.send("Team updated!");
        });
});

app.delete("/deleteTeam/:id", (req, res) => { 
    db.query("DELETE FROM Teams WHERE Team_ID=?", [req.params.id], 
        (err)=>{ if(err) res.status(500).send(err); else res.send("Team deleted!"); }); 
});

/* ----------------------------------
   EDUCATION
---------------------------------- */
app.post("/addEducation", (req, res) => {
    const { USN, Degree, Institution_Name, Field_of_Study } = req.body;

    db.query("INSERT INTO Education (USN, Degree, Institution_Name, Field_of_Study) VALUES (?, ?, ?, ?)", 
        [USN, Degree, Institution_Name, Field_of_Study], 
        (err)=>{ if(err) res.status(500).send(err); else res.send("Education added!"); });
});

app.get("/education", (req, res) => { 
    db.query("SELECT * FROM Education", (err, rows)=>{ 
        if(err) res.status(500).send(err); 
        else res.json(rows); 
    }); 
});

app.put("/updateEducation/:usn", (req, res) => {
    const { Degree, Institution_Name, Field_of_Study } = req.body;
    db.query("UPDATE Education SET Degree=?, Institution_Name=?, Field_of_Study=? WHERE USN=?", 
        [Degree, Institution_Name, Field_of_Study, req.params.usn], 
        (err) => {
            if(err) return res.status(500).send(err);
            res.send("Education updated!");
        });
});

app.delete("/deleteEducation/:usn", (req, res) => {
    db.query("DELETE FROM Education WHERE USN=?", [req.params.usn], 
        (err)=>{ if(err) res.status(500).send(err); else res.send("Education deleted!"); }); 
});

/* ----------------------------------
   MEMBER EDUCATION
---------------------------------- */
app.post("/addMemberEducation", (req, res) => {
    const { USN, Member_ID } = req.body;
    db.query("INSERT INTO Member_Education (USN, Member_ID) VALUES (?, ?)", 
        [USN, Member_ID], 
        (err)=>{ if(err) res.status(500).send(err); else res.send("Member_Education added!"); });
});

app.get("/member_education", (req, res) => { 
    db.query("SELECT * FROM Member_Education", (err, rows)=>{ 
        if(err) res.status(500).send(err); 
        else res.json(rows); 
    }); 
});

/* ----------------------------------
   EDUCATION SKILLS
---------------------------------- */
app.post("/addEducationSkill", (req, res) => {
    const { USN, Skill_Name, Skill_Type } = req.body;

    db.query("INSERT INTO Education_Skills (USN, Skill_Name, Skill_Type) VALUES (?, ?, ?)", 
        [USN, Skill_Name, Skill_Type], 
        (err)=>{ if(err) res.status(500).send(err); else res.send("Skill added!"); });
});

app.get("/education_skills", (req, res) => { 
    db.query("SELECT * FROM Education_Skills", (err, rows)=>{ 
        if(err) res.status(500).send(err); else res.json(rows); 
    }); 
});

/* ----------------------------------
   SESSIONS
---------------------------------- */
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
        SELECT s.Session_ID, s.Session_Name, s.Session_Date, s.Session_Duration, s.Mode_of_Session, 
               m.Member_ID, m.First_Name
        FROM Session_Table s
        LEFT JOIN Member m ON s.Member_ID = m.Member_ID
    `, (err, rows) => {
        if(err) return res.status(500).send({ error: err });
        res.json(rows);
    });
});

/* ----------------------------------
   EVENTS
---------------------------------- */
app.post("/addEvent", (req, res) => {
    const { Event_ID, Event_Name, Event_Date, Event_Duration, Event_Location, Number_of_Participants, Team_ID } = req.body;

    db.query("INSERT INTO Events (Event_ID, Event_Name, Event_Date, Event_Duration, Event_Location, Number_of_Participants, Team_ID) VALUES (?, ?, ?, ?, ?, ?, ?)", 
        [Event_ID, Event_Name, Event_Date, Event_Duration, Event_Location, Number_of_Participants, Team_ID], 
        (err)=>{ if(err) res.status(500).send(err); else res.send("Event added!"); });
});

app.get("/events", (req, res) => { 
    db.query("SELECT * FROM Events", (err, rows)=>{ 
        if(err) res.status(500).send(err); else res.json(rows); 
    }); 
});

/* ----------------------------------
   RUN QUERY — FIXED VERSION
---------------------------------- */
app.post("/runQuery", (req, res) => {
    const { query } = req.body;

    console.log("\n==================");
    console.log("Incoming Query:");
    console.log(query);
    console.log("==================\n");

    db.query(query, (err, rows) => {
        if (err) {
            console.error("SQL ERROR:", err.sqlMessage);
            return res.json({ error: err.sqlMessage });
        }
        res.json(rows);
    });
});

/* ----------------------------------
   START SERVER
---------------------------------- */
app.listen(3000, () => console.log("🚀 Server running at http://localhost:3000"));
