// Tab functionality
function openTab(tabName) {
    const contents = document.querySelectorAll('.tab-content');
    contents.forEach(c => c.style.display = 'none');
    document.getElementById(tabName).style.display = 'block';

    const buttons = document.querySelectorAll('.tab-btn');
    buttons.forEach(b => b.classList.remove('active'));
    event.currentTarget.classList.add('active');

    document.getElementById("searchInput").value = ""; // clear search
    fetchQuery(tabName);
}

// Map tabName to backend queries
const queryMap = {
    sameInstitution: "SELECT DISTINCT e1.USN, m.First_Name, m.Last_Name, e1.Institution_Name FROM Education e1 JOIN Education e2 ON e1.Institution_Name = e2.Institution_Name AND e1.USN <> e2.USN JOIN Member m ON e1.USN = m.Member_ID",
    programmingSkill: "SELECT DISTINCT es1.USN, m.First_Name, m.Last_Name, es1.Skill_Name FROM Education_Skills es1 JOIN Education_Skills es2 ON es1.Skill_Name = es2.Skill_Name AND es1.USN <> es2.USN JOIN Member m ON es1.USN = m.Member_ID",
    sessionsOnline: "SELECT s.Session_ID, s.Session_Name, s.Mode_of_Session, m.First_Name, m.Last_Name FROM Session_Table s JOIN Member m ON s.Member_ID = m.Member_ID WHERE s.Mode_of_Session='Online'",
    sessionsOffline: "SELECT s.Session_ID, s.Session_Name, s.Mode_of_Session, m.First_Name, m.Last_Name FROM Session_Table s JOIN Member m ON s.Member_ID = m.Member_ID WHERE s.Mode_of_Session='Offline'",
    sessionsEventsSameDay: "SELECT s.Session_Name AS Session, e.Event_Name AS Event, s.Session_Date FROM Session_Table s JOIN Events e ON s.Session_Date = e.Event_Date",
    memberMultipleSkills: "SELECT m.Member_ID, m.First_Name, m.Last_Name, COUNT(es.Skill_Name) AS Skill_Count FROM Member m JOIN Education_Skills es ON m.Member_ID = es.USN GROUP BY m.Member_ID HAVING Skill_Count > 1"
};

// Fetch data from backend
async function fetchQuery(tabName){
    const query = queryMap[tabName];
    const res = await fetch("/runQuery", {
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({query})
    });
    const data = await res.json();
    renderTable(tabName, data);
}

// Render table
function renderTable(tabName, data){
    const container = document.getElementById(tabName);
    if(data.length === 0){
        container.innerHTML = "<p>No data found</p>";
        return;
    }
    const keys = Object.keys(data[0]);
    let html = "<table><thead><tr>";
    keys.forEach(k => html += `<th>${k}</th>`);
    html += "</tr></thead><tbody>";
    data.forEach(row => {
        html += "<tr>";
        keys.forEach(k => html += `<td>${row[k]}</td>`);
        html += "</tr>";
    });
    html += "</tbody></table>";
    container.innerHTML = html;
}

// Search filter
document.getElementById("searchInput").addEventListener("keyup", function(){
    const filter = this.value.toLowerCase();
    const visibleTab = document.querySelector('.tab-content:not([style*="display: none"])');
    if(!visibleTab) return;
    const trs = visibleTab.querySelectorAll("tbody tr");
    trs.forEach(tr => {
        const text = tr.innerText.toLowerCase();
        tr.style.display = text.includes(filter) ? "" : "none";
    });
});

// Load default tab
openTab('sameInstitution');
