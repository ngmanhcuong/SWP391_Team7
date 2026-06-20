/** Resolve avatar from DB (filename) or external URL (Google) to a browser-loadable URL. */
export function getAvatarUrl(avatar?: string | null): string | undefined {
  if (!avatar) return undefined;
  if (avatar.startsWith('http://') || avatar.startsWith('https://')) return avatar;
  if (avatar.startsWith('data:image/') || avatar.startsWith('blob:')) return avatar;

  const apiBase = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';
  const serverBase = apiBase.replace(/\/api\/?$/, '');

  if (avatar.startsWith('/uploads/')) return `${serverBase}${avatar}`;
  return `${serverBase}/uploads/avatars/${avatar.replace(/^\/+/, '')}`;
}
