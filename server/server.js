const diningRouter = require("./api/dining");
const accountRouter = require("./api/account");
const eventRouter = require("./api/events");
const scheduleRouter = require("./api/schedule");
const messageRouter = require("./api/messaging");
const homeRouter = require("./api/home");
const account_manager = require("./account_manager");
const cors = require("cors");

const app = require('express')();
const http = require('http').createServer(app);
const io = require("socket.io")(http, {cors: {
    origin: '*',
  }
});
bodyParser = require("body-parser");
port = 3080;

async function initialize_app(){
  await account_manager.startDatabaseConnection();

  // The following lines are meant for testing, and should not be uncommented
  /*
  await account_manager.getUserChats("goodwi13");
  let id = await account_manager.createChatRoom(["goodwi13", "simp"]);
  console.log(id);
  await account_manager.getChatHistory(id);
  account_manager.updateChatHistory("605eab6ba0b72004bfd31ce6","goodwi13", "How are you?");
  */
}

//initialize_app();
app.use(bodyParser.json());
app.use(cors());
app.use("/api/dining", diningRouter);
app.use("/api/account", accountRouter);
app.use("/api/events", eventRouter);
app.use("/api/messaging", messageRouter);
app.use("/api/schedule", scheduleRouter);
app.use("/api/home", homeRouter);


app.get('/', (req,res) => {
  res.send('Default route');
});

io.on('connection', (socket) => {
  console.log('a user connected via socket.io');

  socket.on('join', async(room) => {
    try {
      socket.join(room);
      socket.emit('joined', room)
      console.log("User attempting to join chat: " + room);
      socket.activeRoom = room;
    } catch (err) {
      console.error(err);
    }
  });

  socket.on('message', (room, sender, message) => {
    console.log(room)
    console.log(sender +": " + message)
    account_manager.updateChatHistory(socket.activeRoom, sender, message)
    io.to(room).emit("message-broadcast", sender, message);
  });

  socket.on('disconect', () => {
    console.log('a user disconnected via socket.io');
  });
});

http.listen(process.env.PORT || port, async () => {
  try{
    initialize_app();
    console.log(`Server listening on the port::${port}`);
  }catch(err){
    console.error(err);
  }
});
