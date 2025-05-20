

interface MegaMenuProps {
    key: string;
  title: string;
  items: string[];
}

const MegaMenu = ({ title, items }: MegaMenuProps) => {
  return (
    <div className="mega-menu-container">
      <div className="mega-menu-trigger">
        {title}
        <span className="dropdown-indicator" />
      </div>
      
      <div className="mega-menu-panel">
        <div className="mega-menu-grid">
          {items.map((item) => (
            <a
              key={item}
              href={`/${item.toLowerCase().replace(/ /g, '-')}`}
              className="mega-menu-item"
            >
              {item}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MegaMenu;