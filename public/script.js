const socket = io();
const chatDiv = document.querySelector(".chat");
const roomName = document.querySelector("h2");
const chatForm = document.getElementById("chat");
const ul = document.querySelector("ul");

const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});
console.log(username, room);
socket.emit("joinRoom", { username, room });
roomName.innerHTML = room;
socket.on("chatMsg", (data) => {
  outputMessage(data);
  chatDiv.scrollTop = chatDiv.scrollHeight;
});
socket.on("users", ({ room, users }) => {
  console.log(room, users);
  outputUsers(users);
});
socket.on("redirect", function (destination) {
  console.log("re");
  window.location.href = destination;
});

chatForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const input = e.target.elements.input.value;
  socket.emit("chatMsg", input);
  e.target.elements.input.value = "";
  e.target.elements.input.focus();
});

const hours12 = (date) => date.getHours() % 12 || 12;

function outputMessage(message) {
  const p = document.createElement("p");
  p.classList.add("msg");
  if (message.name !== username) {
    p.classList.add("fromMe");
  }
  let currentdate = new Date();

  let datetime = hours12(currentdate) + ":" + currentdate.getMinutes();
  console.log(message);
  p.textContent = message.msg + " - " + datetime;
  chatDiv.appendChild(p);
}

const outputUsers = (users) => {
  ul.innerHTML = "";
  console.log(users);
  users.forEach((user) => {
    const p = document.createElement("li");
    p.textContent = user.username;
    ul.appendChild(p);
  });
};
