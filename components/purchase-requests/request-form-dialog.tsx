"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Send } from "lucide-react";
import {
  useCreatePurchaseRequest,
  useUpdatePurchaseRequest,
} from "@/hooks/use-purchase-requests";
import { useToast } from "@/hooks/use-toast";
import { getErrorMessage } from "@/lib/api/client";
import { fromApiAmount, toApiAmount } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { TextAreaField, TextField } from "@/components/ui/text-field";
import type { PurchaseRequest } from "@/types/purchase-request";
import styles from "./purchase-requests.module.css";

// Aceita "1250", "1250,50", "1.250,50" ou "1250.50".
const AMOUNT_PATTERN = /^(\d{1,3}(\.\d{3})+|\d+)(,\d{1,2})?$|^\d+(\.\d{1,2})?$/;

const requestSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "O título deve ter pelo menos 3 caracteres.")
    .max(180, "O título deve ter no máximo 180 caracteres."),
  description: z.string().trim().max(2000, "A descrição deve ter no máximo 2000 caracteres."),
  estimatedAmount: z
    .string()
    .trim()
    .regex(AMOUNT_PATTERN, "Informe um valor válido, ex.: 1.250,00")
    .refine((value) => Number(toApiAmount(value)) > 0, "O valor deve ser maior que zero.")
    .refine((value) => Number(toApiAmount(value)) < 1e10, "Valor acima do limite permitido."),
});

type RequestFormValues = z.infer<typeof requestSchema>;

interface RequestFormDialogProps {
  onClose: () => void;
  /** Quando informado, o formulário edita o rascunho em vez de criar um novo. */
  request?: PurchaseRequest | null;
}

function toDefaultValues(request?: PurchaseRequest | null): RequestFormValues {
  return {
    title: request?.title ?? "",
    description: request?.description ?? "",
    estimatedAmount: request ? fromApiAmount(request.estimatedAmount) : "",
  };
}

export function RequestFormDialog({ onClose, request }: RequestFormDialogProps) {
  const isEditing = Boolean(request);
  const toast = useToast();
  const createRequest = useCreatePurchaseRequest();
  const updateRequest = useUpdatePurchaseRequest();
  const isSaving = createRequest.isPending || updateRequest.isPending;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RequestFormValues>({
    resolver: zodResolver(requestSchema),
    defaultValues: toDefaultValues(request),
  });

  const save = (submit: boolean) =>
    handleSubmit(async (values) => {
      const input = {
        title: values.title,
        description: values.description || undefined,
        estimatedAmount: toApiAmount(values.estimatedAmount),
      };

      try {
        if (request) {
          await updateRequest.mutateAsync({ id: request.id, input, submit });
        } else {
          await createRequest.mutateAsync({ input, submit });
        }
        toast.success(
          submit
            ? "Solicitação enviada para aprovação."
            : isEditing
              ? "Rascunho atualizado."
              : "Rascunho salvo.",
        );
        onClose();
      } catch (error) {
        toast.error(getErrorMessage(error));
      }
    });

  return (
    <Modal
      open
      onClose={onClose}
      title={isEditing ? "Editar rascunho" : "Nova solicitação de compra"}
      description="Salve como rascunho para revisar depois ou envie direto para aprovação."
      footer={
        <>
          <Button variant="secondary" onClick={save(false)} disabled={isSaving}>
            Salvar rascunho
          </Button>
          <Button onClick={save(true)} loading={isSaving}>
            {!isSaving && <Send size={15} />}
            Salvar e enviar
          </Button>
        </>
      }
    >
      <form className={styles.form} onSubmit={save(false)} noValidate>
        <TextField
          label="Título"
          placeholder="Ex.: Notebooks para o time de produto"
          autoFocus
          error={errors.title?.message}
          {...register("title")}
        />
        <TextField
          label="Valor estimado (R$)"
          placeholder="0,00"
          inputMode="decimal"
          error={errors.estimatedAmount?.message}
          {...register("estimatedAmount")}
        />
        <TextAreaField
          label="Descrição"
          placeholder="Detalhe o que será comprado e a justificativa (opcional)"
          error={errors.description?.message}
          {...register("description")}
        />
      </form>
    </Modal>
  );
}
