
export interface ItemProps {
  type: 'folder' | 'file';
  name: string;
  childrens?: ItemProps[];
  expanded?: boolean;
}


export const data: ItemProps[] = [
  {
    type: "folder",
    name: "Folder1",
    childrens: [],
    expanded: true,
  },
  {
    type: "folder",
    name: "Folder2",
    childrens: [
      {
        type: 'folder',
        name: '1 Nested Folder1',
        childrens: [],
        expanded: false
      },
      {
        type: 'file',
        name: "1 Nested File1.js"
      }
    ],
    expanded: true,
  }
]
