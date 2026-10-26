"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CircleAlert, Eye, EyeOff, LockKeyhole, Mail } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { getErrorMessage } from "@/lib/api/client";
import { Button } from "@/components/ui/button";
import { TextField } from "@/components/ui/text-field";
import styles from "./login.module.css";

const loginSchema = z.object({
  email: z.email("Informe um e-mail válido."),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres."),
});

type LoginValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const { signIn } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = handleSubmit(async (values) => {
    try {
      await signIn(values);
    } catch (error) {
      setError("root", {
        message: getErrorMessage(error, "Não foi possível entrar. Verifique suas credenciais."),
      });
    }
  });

  return (
    <form className={styles.form} onSubmit={onSubmit} noValidate>
      <TextField
        label="E-mail"
        type="email"
        autoComplete="username"
        placeholder="seu@email.com"
        size="lg"
        icon={<Mail size={18} />}
        error={errors.email?.message}
        {...register("email")}
      />

      <TextField
        label="Senha"
        type={showPassword ? "text" : "password"}
        autoComplete="current-password"
        placeholder="Digite sua senha"
        size="lg"
        icon={<LockKeyhole size={18} />}
        error={errors.password?.message}
        trailing={
          <button
            type="button"
            className={styles.togglePassword}
            onClick={() => setShowPassword((visible) => !visible)}
            aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
            aria-pressed={showPassword}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        }
        {...register("password")}
      />

      {errors.root?.message && (
        <p className={styles.formError} role="alert">
          <CircleAlert size={16} />
          {errors.root.message}
        </p>
      )}

      <Button type="submit" size="lg" fullWidth loading={isSubmitting} className={styles.submit}>
        {isSubmitting ? "Entrando..." : "Entrar"}
      </Button>
    </form>
  );
}
