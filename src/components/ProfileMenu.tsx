import { useState, type FormEvent } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Crown, Loader2, UserRound, Pencil } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuItem, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SignOutButton } from '@/components/SignOutButton';
import { toast } from 'sonner';

export function ProfileMenu() {
  const { user } = useAuth();
  const { profile, isPro, isLoading, isError } = useProfile();
  const queryClient = useQueryClient();
  const [dialog, setDialog] = useState<'edit' | 'upgrade' | null>(null);
  const [name, setName] = useState('');
  const [photo, setPhoto] = useState('');
  const [busy, setBusy] = useState(false);
  async function save(event: FormEvent) {
    event.preventDefault();
    if (!user) return;
    setBusy(true);
    try {
      const { error } = await supabase.from('profiles').update({ display_name: name.trim(), avatar_url: photo.trim() }).eq('id', user.id);
      if (error) throw error;
      await queryClient.invalidateQueries({ queryKey: ['profile', user.id] });
      setDialog(null);
      toast.success('Perfil atualizado');
    } catch { toast.error('Não foi possível salvar seu perfil. Tente novamente.'); }
    finally { setBusy(false); }
  }
  return <div className="ml-auto flex shrink-0 items-center gap-2">
    {isLoading ? <Loader2 className="size-4 animate-spin text-muted-foreground" aria-label="Carregando plano" /> : profile ? <span className={isPro ? 'rounded-md border border-primary/40 bg-primary/10 px-2 py-1 text-xs font-semibold text-primary' : 'rounded-md border border-border bg-secondary px-2 py-1 text-xs font-semibold text-secondary-foreground'}>{isPro ? 'PRO' : 'FREE'}</span> : <span className="text-xs text-muted-foreground">Plano indisponível</span>}
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Minha conta" title="Minha conta">
          <Avatar className="size-8"><AvatarImage src={profile?.avatar_url} alt="Foto do perfil" /><AvatarFallback><UserRound className="size-4" /></AvatarFallback></Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64 max-w-[calc(100vw-2rem)]">
        <DropdownMenuLabel className="space-y-1">
          <p className="break-words">{profile?.display_name || 'Minha conta'}</p>
          <p className="break-all text-xs font-normal text-muted-foreground">{user?.email}</p>
          {profile && <p className="text-xs font-normal text-muted-foreground">Créditos de IA: {profile.ai_credits}</p>}
          {isError && <p className="text-xs text-destructive">Não foi possível carregar o perfil.</p>}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem disabled={!profile} onSelect={() => { setName(profile?.display_name ?? ''); setPhoto(profile?.avatar_url ?? ''); setDialog('edit'); }}><Pencil />Editar perfil</DropdownMenuItem>
        {profile && !isPro && <DropdownMenuItem onSelect={() => setDialog('upgrade')}><Crown className="text-primary" />Fazer Upgrade para o Pro</DropdownMenuItem>}
        <DropdownMenuSeparator />
        <SignOutButton label="Sair da Conta" className="w-full justify-start" />
      </DropdownMenuContent>
    </DropdownMenu>
    <Dialog open={dialog !== null} onOpenChange={(open) => { if (!open) setDialog(null); }}>
      <DialogContent className="max-w-sm">
        <DialogHeader><DialogTitle>{dialog === 'edit' ? 'Meu perfil' : 'Plano Pro'}</DialogTitle><DialogDescription>{dialog === 'edit' ? 'Seu nome e sua foto.' : 'A contratação do Pro ainda não está disponível. Nenhuma cobrança será realizada.'}</DialogDescription></DialogHeader>
        {dialog === 'edit' && <form onSubmit={save} className="space-y-4">
          <div className="space-y-2"><Label htmlFor="profile-name">Nome</Label><Input id="profile-name" value={name} onChange={(e) => setName(e.target.value)} maxLength={120} /></div>
          <div className="space-y-2"><Label htmlFor="profile-photo">Link da foto</Label><Input id="profile-photo" type="url" placeholder="https://…" value={photo} onChange={(e) => setPhoto(e.target.value)} pattern="https://.*" /></div>
          <Button type="submit" disabled={busy} className="w-full">{busy ? 'Salvando…' : 'Salvar perfil'}</Button>
        </form>}
      </DialogContent>
    </Dialog>
  </div>;
}