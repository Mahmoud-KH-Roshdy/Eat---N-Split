import { useState } from "react";
const initialFriends = [
  {
    id: 118836,
    name: "Ali",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Ahmed",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Mahmoud",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

function App() {
  const [showFreind, setShowFreind] = useState(false);
  const [showAddFreind, setShowAddFreind] = useState(initialFriends);
  const [selectFreind, setSelectFreind] = useState(false);
  function handleOpen() {
    setShowFreind(!showFreind);
  }
  function handleAddFreind(friend) {
    setShowAddFreind((friends) => [...friends, friend]);
  }
  function handleRemove(id) {
    setShowAddFreind((friends) => friends.filter((friend) => friend.id !== id));
  }
  function handleSelection(friend) {
    setSelectFreind((selected) => (selected.id === friend.id ? false : friend));
    setShowFreind(false);
  }
  function handleSpillBill(value) {
    setShowAddFreind((friends) =>
      friends.map((friend) =>
        selectFreind.id === friend.id
          ? { ...friend, balance: friend.balance + value }
          : friend
      )
    );
    setSelectFreind(false);
  }
  return (
    <div className="app">
      <div className="sidebar">
        <List
          showAddFreind={showAddFreind}
          handleRemove={handleRemove}
          onSelection={handleSelection}
          selectedFreind={selectFreind}
        />
        {showFreind && <AddFriend handleAddFreind={handleAddFreind} />}
        <Button onClick={handleOpen}>
          {!showFreind ? " Add Friend" : "Close"}
        </Button>
      </div>
      {selectFreind && (
        <FromSplitBill
          selectFreind={selectFreind}
          onSplitBill={handleSpillBill}
        />
      )}
    </div>
  );
}

function List({ showAddFreind, handleRemove, onSelection, selectedFreind }) {
  return (
    <ul>
      {showAddFreind.map((friend) => (
        <Friend
          friend={friend}
          key={friend.id}
          handleRemove={handleRemove}
          onSelection={onSelection}
          selectedFreind={selectedFreind}
        />
      ))}
    </ul>
  );
}
function Friend({ friend, handleRemove, onSelection, selectedFreind }) {
  const isSelected = selectedFreind.id === friend.id;
  return (
    <li className={isSelected ? "selected" : ""}>
      <img src={friend.image} alt={friend.name} />
      <h3> {friend.name}</h3>
      {friend.balance < 0 && (
        <p className="red">
          {" "}
          Your owe {friend.name} {friend.balance}
        </p>
      )}
      {friend.balance > 0 && (
        <p className="green">
          {friend.name} owes you {friend.balance}
        </p>
      )}

      {friend.balance === 0 && (
        <p className=""> You and {friend.name} are even </p>
      )}
      <span onClick={() => handleRemove(friend.id)}>X</span>
      <Button onClick={() => onSelection(friend)}>
        {isSelected ? "Close" : "Select"}
      </Button>
    </li>
  );
}

function Button({ children, onClick }) {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}
function AddFriend({ handleAddFreind }) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("https://i.pravatar.cc/48");
  function handleform(e) {
    e.preventDefault();
    if (!name || !image) return;
    const newFriend = {
      name,
      image,
      balance: 0,
      id: crypto.randomUUID(),
    };
    handleAddFreind(newFriend);
    setName("");
    setImage("https://i.pravatar.cc/48");
  }
  return (
    <form className="form-add-friend" onSubmit={(e) => handleform(e)}>
      <label>Friend Name</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <label>Image URL</label>
      <input
        type="text"
        value={image}
        onChange={(e) => setImage(e.target.value)}
      />
      <Button>Add</Button>
    </form>
  );
}

function FromSplitBill({ selectFreind, onSplitBill }) {
  const [bill, setBill] = useState("");
  const [paidByUser, setPaidByUser] = useState("");
  const [whoIsPaying, setWhoIsPaying] = useState("");
  const paidByFriend = bill ? bill - paidByUser : "";
  function handleSumbit(e) {
    e.preventDefault();
    onSplitBill(whoIsPaying === "user" ? paidByFriend : -paidByUser);
  }
  return (
    <form className="form-split-bill" onSubmit={(e) => handleSumbit(e)}>
      <h2>Split bill with {selectFreind.name} </h2>

      <label>Bill Value</label>
      <input
        type="number"
        value={bill}
        onChange={(e) => setBill(e.target.value)}
      />

      <label> Your expense</label>
      <input
        type="number"
        value={paidByUser}
        onChange={(e) => setPaidByUser(e.target.value)}
      />

      <label> {selectFreind.name}'s expense</label>
      <input type="number" disabled value={paidByFriend} />
      <label>Who is paying the bill </label>
      <select
        value={whoIsPaying}
        onChange={(e) => setWhoIsPaying(e.target.value)}
      >
        <option value="user" key="user">
          You
        </option>
        <option value="freind" key="friend">
          {selectFreind.name}{" "}
        </option>
      </select>
      <Button>Split Bill</Button>
    </form>
  );
}
export default App;
