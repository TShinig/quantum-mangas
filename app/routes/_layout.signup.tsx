import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Link } from "@remix-run/react";
import { createUser, getUserByEmail } from "~/models/user.server";
import { createUserSession, getUserId } from "~/session.server";
import {
  json,
  redirect,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from "@remix-run/node";
import { safeRedirect } from "~/utils";

export const signupSchema = z.object({
  name: z.string()
    .trim()
    .min(1, "Nome é obrigatório"),
  email: z.string()
    .trim()
    .min(1, "Email é obrigatório")
    .email("Email inválido"),
  redirectTo: z.string()
    .default("/"), // Define o valor padrão para "/"
  password: z.string()
    .min(6, "A senha deve ter pelo menos 6 caracteres"),
  confirmPassword: z.string()
    .min(6, "Confirmação de senha é obrigatória")
    .trim() // Remove espaços em branco
  }).refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

/**
 * ? session.server.ts
 * ? user.server.ts
 * ? utils.ts
 */

// Verifica se o usuário ta logado
export const loader = async ({ request }: LoaderFunctionArgs) => {
  const userId = await getUserId(request);
  if (userId) return redirect("/");
  return json({});
};

// Processa os dados do formulário
export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData(); // Pega os dados do formulário
  const name = formData.get("name"); // Extrai o nome
  const email = formData.get("email"); // Extrai o email
  const password = formData.get("password"); // Extrai o password
  const confirmPassword = formData.get("confirmPassword");
  const redirectTo = safeRedirect(formData.get("redirectTo"), "/"); // Verifica o caminho

  // Valida os dados
  const validatedData = signupSchema.parse({
    name,
    email,
    password,
    confirmPassword,
    redirectTo,
  });

  // Verifica se já existe um usuário com o email
  const existingUser = await getUserByEmail(validatedData.email);
  if (existingUser) {
    // Se já existir dá um erro
    return json(
      {
        errors: {
          email: "A user already exists with this email",
          password: null,
        },
      },
      { status: 400 },
    );
  }

  // Cria um novo usuário validado
  const user = await createUser(validatedData.name, validatedData.email, validatedData.password);

  // Cria uma sessão
  return createUserSession({
    redirectTo: validatedData.redirectTo,
    remember: false,
    request,
    userId: user.id,
  });
};

export default function Signup() {
  const form = useForm({
    resolver: zodResolver(signupSchema),
  });

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-cream dark:bg-neutral-900">
      <div className="w-full max-w-md rounded-lg bg-gray-200 px-8 py-6 shadow-md dark:bg-neutral-800">
        <h2 className="mb-6 text-center text-2xl font-bold text-gray-800 dark:text-gray-100">
          Criar Conta
        </h2>
        <Form {...form}>
          <form method="post" className="space-y-4">
          <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-800 dark:text-gray-100">
                    Nome
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Seu Nome"
                      {...field}
                      aria-describedby="name-helper"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-800 dark:text-gray-100">
                    Email
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Seu Email"
                      {...field}
                      aria-describedby="email-helper"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-800 dark:text-gray-100">
                    Senha
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Sua Senha"
                      {...field}
                      aria-describedby="password-helper"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-800 dark:text-gray-100">
                    Confirmação de Senha
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Confirme sua Senha"
                      {...field}
                      aria-describedby="confirmPassword-helper"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full bg-blue-500 text-white transition duration-200 hover:bg-blue-600"
            >
              Criar Conta
            </Button>
          </form>
        </Form>
        <div className="text-center text-sm text-gray-500 dark:text-gray-300">
          Já tem uma conta?{" "}
          <Link to="/signin" className="text-blue-500 underline">
            Entrar
          </Link>
        </div>
      </div>
    </div>
  );
}
