import React from 'react'
import { formatDate } from '../../utils/formatMessageTime';
import { getRoleType } from '../constants/maps';

export default function UserInfoContainer({user}) {
    function InfoRow({ label, value }) {
        return (
          <div className="info-row">
            <span className="info-label">{label}</span>
            <span className="info-value">{value}</span>
          </div>
        );
      }
  return (
    <div>
      <div className="info-card">
            <InfoRow label="Имя" value={user?.name || "Без имени"} />
            <InfoRow label="Email" value={user?.email || "Без email"} />
            <InfoRow label="Дата регистрации" value={formatDate(user?.createdAt) || "Без даты регистрации"} />
            <InfoRow label="Роль" value={getRoleType(user?.role) || "Без роли"} />
          </div>
    </div>
  )
}
