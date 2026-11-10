export function authErrorMessage(error: { code?: string; message?: string }): string {
  const code = error.code ?? '';
  const message = (error.message ?? '').toLowerCase();
  if (code === 'weak_password' || message.includes('password should')) return 'Senha fraca. Use uma senha mais longa, com letras, números e símbolos.';
  if (code === 'user_already_exists' || code === 'email_exists' || message.includes('already registered')) return 'Este e-mail já está cadastrado. Entre na sua conta ou redefina a senha.';
  if (code === 'invalid_credentials' || message.includes('invalid login')) return 'E-mail ou senha incorretos. Confira os dados e tente novamente.';
  if (code === 'email_not_confirmed') return 'Confirme seu e-mail antes de entrar. Confira também a pasta de spam.';
  if (code.includes('rate_limit') || message.includes('rate limit')) return 'Muitas tentativas. Aguarde alguns minutos e tente novamente.';
  return 'Não foi possível concluir. Verifique sua conexão e tente novamente.';
}