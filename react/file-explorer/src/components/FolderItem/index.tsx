
export interface FolderItemProps {
  type: 'folder' | 'file';
  name: string;
  childrens?: FolderItemProps[];
  expanded?: boolean;
  path?: number[];
  onDelete?: (path: number[]) => void;
  onAdd?: (path: number[]) => void;
  onExpanded?: (path: number[], expand: boolean) => void;
}

const FolerItem = ({
  type,
  name,
  childrens,
  expanded,
  path = [],
  onDelete,
  onAdd,
  onExpanded
}: FolderItemProps) => {


  return (
    <>
      <div className="folder-item">
        <div style={{width: (path.length - 1) * 30}} />
        {type === 'folder' && <button className="expand-btn" onClick={() => onExpanded?.(path, !expanded)}>{expanded ? "-" : "+"}</button>}
        <p className="name">{name}</p>
        <div className="action-container">
          {type === 'folder' && <button className="add-btn" onClick={() => onAdd?.(path)}>Add</button>}
          <button className="delete-btn" onClick={() => onDelete?.(path)}>Delete</button>
        </div>
      </div>
      {type === 'folder' && expanded && childrens && childrens?.length > 0 && (
        <div className="children">
          {childrens.map((item, index) => (
            <FolerItem
              key={`${item.type}-${item.name}-${index}`}
              type={item.type}
              name={item.name}
              childrens={item.childrens}
              expanded={item.expanded}
              path={[...path, index]}
              onDelete={onDelete}
              onAdd={onAdd}
              onExpanded={onExpanded}
            />
          ))}
        </div>
      )}
    </>
  )
}

export default FolerItem;
