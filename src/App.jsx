import { useEffect, useMemo, useRef, useState } from "react";
import { Menu, Input } from "antd";
import { PlusOutlined, MenuOutlined, GithubOutlined } from "@ant-design/icons";
import "./App.css";

const { TextArea } = Input;

// 定数

const KEY_NOTES = "notes";
const MAX_NOTE_COUNT = 100;

// 変数

const menuItems = [
  {
    key: "list",
    icon: <MenuOutlined />,
    title: "Menu",
  },
  {
    key: "new",
    icon: <PlusOutlined />,
    title: "New",
  },
  {
    key: "github",
    icon: <GithubOutlined />,
    title: "Github",
  },
];

function App() {
  // ステート フック

  const [isListShow, setListShow] = useState(false);
  const [notes, setNotes] = useState(
    (JSON.parse(localStorage.getItem(KEY_NOTES)) || []).map(({ id, text }) => ({
      id,
      text,
      noteName: text.trim() ? text : "Empty",
    }))
  );
  const [selectedKeys, setSelectedKeys] = useState([]);

  // 変数

  const listItems = notes.map((note) => ({
    label: note.noteName,
    key: note.id,
  }));

  // ref フック

  const textarea = useRef(null);

  // メソッド

  const addNote = () => {
    const id = Math.random().toString(36).slice(2);
    const newNote = { id, text: "", noteName: "Empty" };
    setNotes([newNote, ...notes].slice(0, MAX_NOTE_COUNT));
    return newNote;
  };

  const toggleList = () => setListShow(!isListShow);

  // メモ フック

  const text = useMemo(() => {
    const id = selectedKeys[0];
    if (!id) {
      return "";
    }
    const note = notes.find((x) => x.id === id);
    return note.text;
  }, [notes, selectedKeys]);

  // 副作用フック

  useEffect(() => setSelectedKeys([addNote().id]), []);

  useEffect(() => textarea.current.focus(), [isListShow, selectedKeys]);

  // イベント ハンドラー

  const handleChange = (event) => {
    const id = selectedKeys[0];
    const index = notes.findIndex((x) => x.id === id);
    const newNote = {
      id,
      text: event.target.value,
      noteName: event.target.value.trim() ? event.target.value : "Empty",
    };
    const newNotes = [
      newNote,
      ...notes.slice(0, index),
      ...notes.slice(index + 1),
    ];
    setNotes(newNotes);
    localStorage.setItem(
      KEY_NOTES,
      JSON.stringify(
        newNotes.map(({ id, text }) => ({
          id,
          text,
        }))
      )
    );
  };

  const handleClick = ({ key }) => {
    switch (key) {
      case "list":
        toggleList();
        break;
      case "new":
        notes[0].text.trim() === ""
          ? setSelectedKeys([notes[0].id])
          : setSelectedKeys([addNote().id]);
        // checks if previous note is empty, if empty it focus on text-area, if false then it addsNote
        break;
      case "github":
        window.open("https://github.com/AsaiToshiya/n")
      break;
    }
  };

  return (
    <div className="App">
      {/* メニュー */}
      <Menu
        className="App-menu"
        inlineCollapsed={true}
        items={menuItems}
        mode="inline"
        onClick={handleClick}
        selectable={false}
      />

      {/* メモ リスト */}
      {isListShow && (
        <div className="App-list">
          <Menu
            className="App-list-menu"
            items={listItems}
            mode="inline"
            onSelect={({ key }) => setSelectedKeys([key])}
            selectedKeys={selectedKeys}
          />
        </div>
      )}

      {/* テキスト エリア */}
      <TextArea
        bordered={false}
        className="App-text"
        onChange={handleChange}
        ref={textarea}
        value={text}
      />
    </div>
  );
}

export default App;
