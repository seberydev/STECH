const soporte = document.getElementById("soporte").value;
const nombre = document.getElementById("nombre").value;
const responseCode = document.getElementById("responseCode");

const socket = io();

const enviarBtn = document.getElementById("enviarBtn");
const enviarInput = document.getElementById("enviarInput");

const chatContainer = document.getElementById("chatContainer");

const normalListener = () => {
  const encodedStr = enviarInput.value
    .trim()
    .replace(/[\u00A0-\u9999<>\&]/g, function (i) {
      return "&#" + i.charCodeAt(0) + ";";
    });

  chatContainer.insertAdjacentHTML(
    "afterbegin",
    `<p class=" m-6 flex font-medium border-gray-300 border-5" style="padding:10px"> TU -> ${encodedStr}</p>`
  );

  socket.emit("client:send-message", { message: encodedStr, nombre });
};

const authListener = () => {
  const encodedStr = enviarInput.value
    .trim()
    .replace(/[\u00A0-\u9999<>\&]/g, function (i) {
      return "&#" + i.charCodeAt(0) + ";";
    });

  chatContainer.insertAdjacentHTML(
    "afterbegin",
    `<p class=" m-6 flex font-medium border-gray-300 border-5" style="padding:10px"> TU -> ${encodedStr}</p>`
  );

  socket.emit("client:respond", {
    id: responseCode.value,
    message: encodedStr,
  });
};

enviarBtn.addEventListener("click", soporte ? authListener : normalListener);

const insertarMensaje = (message, nombre) => {
  const encodedStr = message
    .trim()
    .replace(/[\u00A0-\u9999<>\&]/g, function (i) {
      return "&#" + i.charCodeAt(0) + ";";
    });

  chatContainer.insertAdjacentHTML(
    "afterbegin",
    `<p class=" m-6 flex font-medium border-gray-300 border-5" style="padding:10px"> ${nombre} -> ${encodedStr}</p>`
  );
};

socket.on("server:send-message", (payload) => {
  if (!soporte) return;

  insertarMensaje(payload.message, payload.id);
});

socket.on("server:respond", (payload) => {
  insertarMensaje(payload.message, "Soporte");
});
