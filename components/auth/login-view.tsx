import Link from "next/link";
import { AuthLayout } from "./auth-layout";
import { LoginForm } from "./login-form";

export function LoginView() {
  return (
    <AuthLayout
      title="Bem-vindo(a) de volta"
      description="Entre com suas credenciais para acessar sua conta."
      switchPrompt={
        <>
          Ainda não tem conta? <Link href="/cadastro">Criar conta</Link>
        </>
      }
    >
      <LoginForm />
    </AuthLayout>
  );
}
