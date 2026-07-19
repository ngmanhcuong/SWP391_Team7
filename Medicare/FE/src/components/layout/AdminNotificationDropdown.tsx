import React from 'react';
import AppNotificationDropdown from './AppNotificationDropdown';

const AdminNotificationDropdown: React.FC = () => (
  <AppNotificationDropdown footerHref="/admin" footerLabel="Mở dashboard quản trị" />
);

export default AdminNotificationDropdown;
