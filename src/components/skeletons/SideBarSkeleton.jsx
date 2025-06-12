import { Users } from "lucide-react";

const SideBarSkeleton = () => {
  // Create 8 skeleton items
  const skeletonContacts = Array(8).fill(null);

  return (
    <aside className="sidebar-skeleton">
      <div className="sidebar-header">
        <div className="header-content">
          <Users className="icon" />
          <span className="header-text">Чаты</span>
        </div>
      </div>

      <div className="skeleton-contacts">
        {skeletonContacts.map((_, idx) => (
          <div key={idx} className="contact-item">
            <div className="avatar-skeleton">
              <div className="skeleton avatar" />
            </div>

            <div className="user-info-skeleton">
              <div className="skeleton header-skeleton" />
              <div className="skeleton subheader-skeleton" />
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
};

export default SideBarSkeleton;