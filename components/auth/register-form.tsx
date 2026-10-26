"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CircleAlert, Eye, EyeOff, LockKeyhole, Mail, UserRound } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { ApiError, getErrorMessage } from "@/lib/api/client";
import { Button } from "@/components/ui/button";
import { TextField } from "@/components/ui/text-field";
import styles from "./login.module.css";

const registerSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Informe seu nome completo.")
      .max(150, "O nome deve ter no máximo 150 caracteres."),
    email: z
      .email("Informe um e-mail válido.")
      .max(180, "O e-mail deve ter no máximo 180 caracteres."),
    password: z
      .string()
      .min(8, "A senha deve ter pelo menos 8 caracteres.")
      .max(72, "A senha deve ter no máximo 72 caracteres."),
    confirmPassword: z.string(),
  })
  .refine((values) => values.password === values.confirmPassword, {
    path: ["confirmPassword"],
    message: "As senhas não coincidem.",
  });

type RegisterValues = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const { signUp } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
  });

  const onSubmit = handleSubmit(async ({ name, email, password }) => {
    try {
      await signUp({ name, email, password });
    } catch (error) {
      if (error instanceof ApiError && error.status === 409) {
        setError("email", { message: error.message });
        return;
      }
      setError("root", { message: getErrorMessage(error, "Não foi possível criar sua conta.") });
    }
  });

  const passwordToggle = (
    <button
      type="button"
      className={styles.togglePassword}
      onClick={() => setShowPassword((visible) => !visible)}
      aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
      aria-pressed={showPassword}
    >
      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
    </button>
  );

  return (
    <form className={styles.form} onSubmit={onSubmit} noValidate>
      <TextField
        label="Nome completo"
        autoComplete="name"
        placeholder="Como você quer ser chamado(a)"
        size="lg"
        icon={<UserRound size={18} />}
        error={errors.name?.message}
        {...register("name")}
      />

      <TextField
        label="E-mail"
        type="email"
        autoComplete="email"
        placeholder="seu@email.com"
        size="lg"
        icon={<Mail size={18} />}
        error={errors.email?.message}
        {...register("email")}
      />

      <TextField
        label="Senha"
        type={showPassword ? "text" : "password"}
        autoComplete="new-password"
        placeholder="Mínimo de 8 caracteres"
        size="lg"
        icon={<LockKeyhole size={18} />}
        trailing={passwordToggle}
        error={errors.password?.message}
        {...register("password")}
      />

      <TextField
        label="Confirmar senha"
        type={showPassword ? "text" : "password"}
        autoComplete="new-password"
        placeholder="Repita a senha"
        size="lg"
        icon={<LockKeyhole size={18} />}
        error={errors.confirmPassword?.message}
        {...register("confirmPassword")}
      />

      {errors.root?.message && (
        <p className={styles.formError} role="alert">
          <CircleAlert size={16} />
          {errors.root.message}
        </p>
      )}

      <Button type="submit" size="lg" fullWidth loading={isSubmitting} className={styles.submit}>
        {isSubmitting ? "Criando conta..." : "Criar conta"}
      </Button>
    </form>
  );
}
