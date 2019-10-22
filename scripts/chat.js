//adding new chat documents
//setting up a real-time listeners to get new chats
//updating the username
//updating the room 

class Chatroom {
  constructor(room, username){
    this.room = room;
    this.username = username;
    this.chats = db.collection('chats');
    this.unsub;
  }

  //adding new chat documents
  async addChat(message){
    //format a chat object 
    const now = new Date();
    const chat = {
        message,
        username: this.username,
        room: this.room,
        created_at: firebase.firestore.Timestamp.fromDate(now)
    };

    //save the chat document 
    const response = await this.chats.add(chat);
    return response;
  }
  
  //setting up a real-time listeners to get new chats
  getChats(callback){
    // reference to the chat collection
    this.unsub = this.chats
    .where('room','==',this.room)
    .orderBy('created_at')
      .onSnapshot(snapshot => { 
        snapshot.docChanges().forEach(change => {
          //console.log(change);
          if(change.type === 'added'){
            //update the ui
            callback(change.doc.data());
          }
        })
      })
  }
  
  //update username
  updateName(username){
    this.username = username;
    localStorage.setItem('username', username);
  }
  
  //update room
  updateRoom(room){
    this.room = room;
    console.log('room updated');
    if(this.unsub){
       this.unsub();
       }
  }
}


//setTimeout(() => {
//  chatroom.updateRoom('gaming');
//  chatroom.updateName('anita');
//  chatroom.getChats((data) => {
//    console.log(data);
//  });
//  chatroom.addChat('helloooo');
//}, 3000);


