const userDataToStore = {
  id: userId,
  email: user.email,
  firstName: user.firstName,
  lastName: user.lastName,
};
localStorage.setItem("loggedInUser", JSON.stringify(userDataToStore));
