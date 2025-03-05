import { Users } from "lucide-react";

const SideBarSkeleton = () => {
  // Create 8 skeleton items
  const skeletonContacts = Array(8).fill(null);

  return (
    <aside className="sidebar-skeleton">
      {/* Header */}
      <div className="sidebar-header">
        <div className="header-content">
          <Users className="icon" />
          <span className="header-text">Contacts</span>
        </div>
      </div>

      {/* Skeleton Contacts */}
      <div className="skeleton-contacts">
        {skeletonContacts.map((_, idx) => (
          <div key={idx} className="contact-item">
            {/* Avatar skeleton */}
            <div className="avatar-skeleton">
              <div className="skeleton avatar" />
            </div>

            {/* User info skeleton - only visible on larger screens */}
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