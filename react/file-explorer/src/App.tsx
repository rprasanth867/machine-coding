import { useState, type FormEvent } from 'react'
import './App.css'
import { data, type ItemProps } from './data';
import FolerItem from './components/FolderItem';

const updateAtPath = (
  items: ItemProps[],
  path: number[],
  update: (item: ItemProps) => ItemProps,
): ItemProps[] => {
  const [index, ...remainingPath] = path;
  if (index === undefined || index < 0 || index >= items.length) return items;

  return items.map((item, itemIndex) => {
    if (itemIndex !== index) return item;
    if (remainingPath.length === 0) return update(item);
    if (item.type !== 'folder') return item;
    return {
      ...item,
      childrens: updateAtPath(item.childrens ?? [], remainingPath, update),
    };
  });
};

const removeAtPath = (items: ItemProps[], path: number[]): ItemProps[] => {
  const [index, ...remainingPath] = path;
  if (index === undefined || index < 0 || index >= items.length) return items;
  if (remainingPath.length === 0) return items.filter((_, itemIndex) => itemIndex !== index);

  return items.map((item, itemIndex) => {
    if (itemIndex !== index || item.type !== 'folder') return item;
    return {
      ...item,
      childrens: removeAtPath(item.childrens ?? [], remainingPath),
    };
  });
};

function App() {
  const [foldersData, setFoldersData] = useState(data);
  const [addData, setAddData] = useState<{ show: boolean; path?: number[] }>({ show: false });

  const handleDelete = (path: number[]) => {
    setFoldersData((current) => removeAtPath(current, path));
  }

  const handleAdd = (path: number[]) => {
    setAddData({ show: true, path });
  };

  const handleExpand = (path: number[], expand: boolean) => {
    setFoldersData((current) => updateAtPath(current, path, (item) => ({ ...item, expanded: expand })));
  }

  const handleSubmit = (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = String(formData.get('name') ?? '').trim();
    const type = formData.get('type');

    if (!name || (type !== 'folder' && type !== 'file') || !addData.path) return;

    const newItem: ItemProps = {
      name,
      type,
      ...(type === 'folder' ? { childrens: [], expanded: false } : {}),
    };

    setFoldersData((current) => updateAtPath(current, addData.path!, (item) => ({
      ...item,
      expanded: true,
      childrens: [...(item.childrens ?? []), newItem],
    })));
    setAddData({ show: false });
  }

  return (
    <div className='app'>
      {addData?.show && (
        <form onSubmit={handleSubmit}>
          <label>
            Name
            <input required type="text" id="name" name="name" />
          </label>
          <label>
            Folder
            <input required type="radio" name="type" value="folder" />
          </label>
          <label>
            File
            <input required type="radio" name="type" value="file" />
          </label>
          <button type="submit">Add</button>
        </form>
      )}
      {foldersData.map((item, index) => (
        <FolerItem
          key={`${item.type}-${item.name}-${index}`}
          type={item.type}
          name={item.name}
          childrens={item.childrens}
          expanded={item.expanded}
          path={[index]}
          onDelete={handleDelete}
          onAdd={handleAdd}
          onExpanded={handleExpand}
        />
      ))}
    </div>
  )
}

export default App
