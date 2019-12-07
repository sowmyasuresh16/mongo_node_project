console.log('Client-side code running');
const q1button = win.getElementById('qb1');
const q2button = win.getElementById('qb2');
const q3button = win.getElementById('qb3');
const q4button = win.getElementById('qb4');
const q5button = win.getElementById('qb5');
q1button.addEventListener('click', function (e) {
    console.log('button1 was clicked');
    fetch('/clickedone', { method: 'GET' })
        .then(res => res.json())
        .then(function (response) {
            var data = JSON.parse(JSON.stringify(response));
            var text = "";
            text += "<table><thead><tr><th>Gender</th><th>First Name</th><th>Last Name</th><th>Date of Birth</th></tr></thead><tbody>";
            for (var i = 0; i < data.length; i++) {
                text += "<tr><td>" + data[i]["_id"] + "</td>" + "<td>" + data[i]["First Name"] + "</td>" + "<td>" + data[i]["Last Name"] + "</td>" + "<td>" + data[i]["Date of Birth"] + "</td></tr>";
            }
            text += "</tbody></table>";
            document.getElementById("queryheading").innerHTML = "You have clicked Query 1. Displaying Oldest employees";
            document.getElementById("queryresult").innerHTML = text;
        })
        .catch(function (error) {
            console.log(error);
        });
});
q2button.addEventListener('click', function (e) {
    console.log('button2 was clicked');
    fetch('/clickedtwo', { method: 'GET' })
        .then(res => res.json())
        .then(function (response) {
            var data = JSON.parse(JSON.stringify(response));
            var text = "";
            text += "<table><thead><tr><th>Department Id</th><th>Count</th></tr></thead><tbody>";
            for (var i = 0; i < data.length; i++) {
                text += "<tr><td>" + data[i]["_id"] + "</td>" + "<td>" + data[i]["count"] + "</td></tr>";
            }
            text += "</tbody></table>";
            document.getElementById("queryheading").innerHTML = "You have clicked Query 2. Displaying number of employees in each department";
            document.getElementById("queryresult").innerHTML = text;
        })
        .catch(function (error) {
            console.log(error);
        });
});
q3button.addEventListener('click', function (e) {
    console.log('button3 was clicked');
    fetch('/clickedthree', { method: 'GET' })
        .then(res => res.json())
        .then(function (response) {
            var data = JSON.parse(JSON.stringify(response));
            var text = "";
            text += "<table><thead><tr><th>Manager Department</th><th>Gender</th><th>Count</th></tr></thead><tbody>";
            for (var i = 0; i < data.length; i++) {
                text += "<tr><td>" + data[i]._id["dept"] + "</td>" + "<td>" + data[i]._id["gender"] + "</td>" + "<td>" + data[i]["count"] + "</td></tr>";
            }
            text += "</tbody></table>";
            document.getElementById("queryheading").innerHTML = "You have clicked Query 3. Displaying breakdown of department managers";
            document.getElementById("queryresult").innerHTML = text;
        })
        .catch(function (error) {
            console.log(error);
        });
});
q4button.addEventListener('click', function (e) {
    console.log('button4 was clicked');
    fetch('/clickedfour', { method: 'GET' })
        .then(res => res.json())
        .then(function (response) {
            var data = JSON.parse(JSON.stringify(response));
            var text = "";
            text += "<table><thead><tr><th>Department</th><th>Gender</th><th>Salary</th></tr></thead><tbody>";
            for (var i = 0; i < data.length; i++) {
                text += "<tr><td>" + data[i]["d"] + "</td>" + "<td>" + data[i]["_id"] + "</td>" + "<td>" + data[i]["s"] + "</td></tr>";
            }
            text += "</tbody></table>";
            document.getElementById("queryheading").innerHTML = "You have clicked Query 4. Displaying the department with highest paid employee";
            document.getElementById("queryresult").innerHTML = text;
        })
        .catch(function (error) {
            console.log(error);
        });
});
q5button.addEventListener('click', function (e) {
    console.log('button5 was clicked');
    fetch('/clickedfive', { method: 'GET' })
        .then(res => res.json())
        .then(function (response) {
            var data = JSON.parse(JSON.stringify(response));
            var text = "";
            text += "<table><thead><tr><th>Designation</th><th>Tenure in Years</th></tr></thead><tbody>";
            for (var i = 0; i < data.length; i++) {
                text += "<tr><td>" + data[i]["_id"] + "</td>" + "<td>" + data[i]["Floored"] + "</td></tr>";
            }
            text += "</tbody></table>";
            document.getElementById("queryheading").innerHTML = "You have clicked Query 5. Displaying average duration of titles";
            document.getElementById("queryresult").innerHTML = text;
        })
        .catch(function (error) {
            console.log(error);
        });
});

