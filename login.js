function togglePassword() {
    const pass = document.getElementById("password");
    pass.type = pass.type === "password" ? "text" : "password";
}

// SIGNUP
function signup() {
    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    if (!username || !email || !password) {
        alert("Fill all fields");
        return;
    }

    firebase.auth().createUserWithEmailAndPassword(email, password)
        .then(userCredential => {
            userCredential.user.sendEmailVerification()
                .then(() => alert("Verification email sent. Check your inbox."));

            firebase.database().ref("users/" + username).set({
                username: username,
                email: email,
                password: password,
                role: "user"
            });
        })
        .catch(error => alert(error.message));
}

// LOGIN
function login() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    if(!username || !password){
        alert("Fill username & password");
        return;
    }

    firebase.database().ref("users/" + username).once("value")
        .then(snapshot => {
            const data = snapshot.val();
            if(!data) { alert("User not found"); return; }

            if(data.password !== password){
                alert("Incorrect password");
                return;
            }

            firebase.auth().signInWithEmailAndPassword(data.email, data.password)
                .then(authUser => {
                    if(!authUser.user.emailVerified){
                        alert("Please verify your email before logging in.");
                        document.getElementById("resendBtn").style.display = "block";
                        return;
                    }

                    document.getElementById("loginDiv").style.display = "none";
                    document.getElementById("mapDiv").style.display = "block";
                    document.getElementById("userNameDisplay").innerText =
                        "Welcome " + username + " (" + data.role + ")";

                    if(data.role === "user") {
                        if(typeof startAutoTracking === "function") startAutoTracking(username);
                    } else if(data.role === "admin") {
                        if(typeof initAdminMap === "function") initAdminMap();
                        if(typeof listenAllUsersLocation === "function") listenAllUsersLocation();
                    }

                    document.getElementById("mapDiv").scrollIntoView({ behavior: "smooth" });
                })
                .catch(err => alert("Login failed: " + err.message));
        })
        .catch(err => alert(err.message));
}

// RESEND verification email
function resendVerification() {
    const username = document.getElementById("username").value;
    if(!username) { alert("Enter username first."); return; }

    firebase.database().ref("users/" + username).once("value")
        .then(snapshot => {
            const data = snapshot.val();
            if(!data) { alert("User not found."); return; }

            firebase.auth().signInWithEmailAndPassword(data.email, data.password)
                .then(userCredential => {
                    userCredential.user.sendEmailVerification()
                        .then(() => alert("Verification email resent."));
                });
        });
}

// LOGOUT
function logout() {
    firebase.auth().signOut()
    .then(() => location.reload())
    .catch(err => alert("Logout failed: " + err.message));
}
