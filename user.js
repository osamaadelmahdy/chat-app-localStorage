const users = [];
const userJoin = (id, username, room) => {
  const userExist = users.find((user) => {
    return user.id == id;
  });

  console.log("userExist", userExist);

  if (userExist) {
    return userExist;
  } else {
    user = { id, username, room };
    users.push(user);
    return user;
  }
};

const getCurentUser = (id) => {
  return users.find((user) => {
    return user.id === id;
  });
};

const getusers = (roomId) => {
  return users.filter((user) => {
    return user.room === roomId;
  });
};

const deleteUser = (id) => {
  const index = users.findIndex((user) => {
    return user.id === id;
  });
  if (index !== -1) return users.splice(index, 1);
};

module.exports = {
  userJoin,
  getCurentUser,
  getusers,
  deleteUser,
};
