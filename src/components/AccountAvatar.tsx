import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
export function AccountAvatar({ name, url, className = 'h-8 w-8' }: { name: string; url?: string | null; className?: string }) {
  return <Avatar className={className}><AvatarImage src={url || undefined} alt="" /><AvatarFallback>{name.charAt(0).toUpperCase() || '用'}</AvatarFallback></Avatar>;
}
