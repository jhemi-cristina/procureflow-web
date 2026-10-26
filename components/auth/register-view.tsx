import Link from "next/link";
import { AuthLayout } from "./auth-layout";
import { RegisterForm } from "./register-form";

export function RegisterView() {
  return (
    <AuthLayout
      title="Crie sua conta"
      description="Cadastre-se para criar e acompanhar suas solicitações de compra."
      switchPrompt={
        <>
          Já tem uma conta? <Link href="/login">Entrar</Link>
        </>
      }
    >
      <RegisterForm />
    </AuthLayout>
  );
}
