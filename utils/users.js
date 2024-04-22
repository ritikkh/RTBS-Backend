const users = []
const addUser=({name, roomId, userId, host, presenter, socketId})=>{
    const user = {name, roomId, userId, host, presenter, socketId};
    users.push(user)
    return users.filter(user=>user.roomId===roomId)
}

const removeUser=(id)=>{
    const index=users.findIndex(user=>user.socketId===id)
    if(index!=-1){
        return users.splice(index,1)[0]
    }
}

const getUser=(id)=>{
    return users.find(user=>user.socketId===id)
}

const getUserInRoom=(roomId)=>{
    return users.find(user=>user.roomId===roomId)
}

module.exports = {
    addUser,
    removeUser,
    getUser,
  };