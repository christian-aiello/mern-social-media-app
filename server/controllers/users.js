import User from '../models/User';

/* READ */
export const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    delete user.password;
    res.status(200).json(user);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const getUserFriends = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    const friends = await Promise.all(
      user.friends.map((i) => User.findById(i)),
    );

    const formattedFriends = friends.map(
      ({
        _id, firstName, lastName, occupation, location, picturePath,
      }) => ({
        _id, firstName, lastName, occupation, location, picturePath,
      }),
    );
    res.status(200).json(formattedFriends);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

/* UPDATE */
export const addRemoveFriend = async (req, res) => {
  try {
    const { id, friendId } = req.params;
    const user = await User.findById(id);
    const friend = await User.findById(friendId);

    if (user.freinds.includes(friendId)) {
      user.friends = user.friends.filter((i) => i !== friendId);
      friend.friends = friend.friends.filter((i) => i !== id);
    } else {
      user.friends.push(friendId);
      friend.friends.push(id);
    }
    await user.save();
    await friend.save();

    const friends = await Promise.all(
      user.friends.map((i) => User.findById(i)),
    );

    const formattedFriends = friends.map(
      ({
        _id, firstName, lastName, occupation, location, picturePath,
      }) => ({
        _id, firstName, lastName, occupation, location, picturePath,
      }),
    );
    res.status(200).json(formattedFriends);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};
