import { useEffect, useMemo, useRef, useState } from "react";
import "antd/dist/antd.css";
import { Menu } from "antd";
import { PlusOutlined, MenuOutlined, GithubOutlined } from "@ant-design/icons";
import "./App.css";

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
    setSelectedKeys([id]);
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

  useEffect(() => addNote(), []);

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
        addNote();
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
        <div className="list">
          <Menu
            items={listItems}
            mode="inline"
            onSelect={({ key }) => setSelectedKeys([key])}
            selectedKeys={selectedKeys}
          />
        </div>
      )}

      {/* テキスト エリア */}
      <textarea
        className="text"
        onChange={handleChange}
        ref={textarea}
        value={text}
      />
    </div>
  );
}

export default App;
