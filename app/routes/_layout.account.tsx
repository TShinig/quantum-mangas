import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from "~/components/ui/dialog";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "~/components/ui/carousel";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Card, CardContent } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import Autoplay from "embla-carousel-autoplay";
import {
  json,
  redirect,
  type LoaderFunction,
  type LoaderFunctionArgs,
} from "@remix-run/node";
import { getUser } from "~/session.server";
import { useLoaderData } from "@remix-run/react";
import { Form } from "~/components/ui/form";
import { useForm } from "react-hook-form";
import { updateUser } from "~/models/user.server";
import { ALLOWED_FILE_TYPES, uploadFile } from "~/api/uploadFile";
import { useState } from "react";

/*
  Não sei como cheguei nesses códigos, foi muita gambiarra
  e tive que ir até no chatgpt pra tentar entender oque eu tava fazendo.

  OBS: no arquivo uploadFile não foi um bixo de 7 cabeças por que uns anos
  atrás quando tava estudando python eu fiz algo semelhante.
*/

export async function loader({ request }: LoaderFunctionArgs) {
  // Obtém o usuário autenticado a partir da solicitação feita.
  const user = await getUser(request);
  if (!user) {
    // Erro se não houver usuário.
    throw new Response("Unauthorized", { status: 401 });
  }

  // Extrai informações do usuário.
  const { id: userId, name, bio, cover, avatar } = user;
  return json({
    userId,
    name: name ?? "Nome do usuário",
    bio: bio ?? "Esta é a bio do usuário.",
    cover: cover ?? "https://via.placeholder.com/800x200",
    avatar: avatar ?? "https://github.com/shadcn.png",
  });
}

export const action: LoaderFunction = async ({ request }: LoaderFunctionArgs) => {
  // Obtém os dados do formulário.
  const formData = await request.formData();
  // Extrai o userId do formulário
  const userId = formData.get("userId")?.toString();

  if (!userId) {
    // Erro se o userId não aparecer.
    throw new Error("User ID is required");
  }

  // Verifica o usuário autenticado.
  const user = await getUser(request);
  if (!user) {
    // Erro se não tiver usuário.
    throw new Response("Unauthorized", { status: 401 });
  }

  // Sei lá, tive que pegar do chatgpt pq tava dando um erro que não consegui resolver.
  const getStringField = (field: FormDataEntryValue | null, fallback: string | null) =>
    (field?.toString() || fallback) ?? undefined;

  // Sei lá, tive que pegar do chatgpt pq tava dando um erro que não consegui resolver.
  const getFileField = async (field: FormDataEntryValue | null, fallback: string | null) => {
    // Aqui eu sei que ta verificando se o arquivo é válido. 🤙
    if (field instanceof File && ALLOWED_FILE_TYPES.includes(field.type)) {
      return await uploadFile(field); // Faz upload se for um arquivo válido.
    }
    return fallback ?? undefined; // Retorna valor padrão se não for válido?
  };

  // Ta preparando os dados para serem atualizados.
  const updatedData: Record<string, string | undefined> = {
    name: getStringField(formData.get("name"), user.name),
    bio: getStringField(formData.get("bio"), user.bio),
    cover: await getFileField(formData.get("cover"), user.cover),
    avatar: await getFileField(formData.get("avatar"), user.avatar),
  };

  // Atualiza informações do usuário no banco de dados.
  await updateUser(userId, updatedData); // Fiz essa função no models/user.server.ts
  return redirect("/account");
};

export default function Profile() {
  const form = useForm();
  const data = useLoaderData<typeof loader>();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [tempProfileData, setTempProfileData] = useState(data);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    // Extrai o nome e valor do campo.
    const { name, value } = event.target;
    // Atualiza os dados temporários.
    setTempProfileData({ ...tempProfileData, [name]: value });
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    // Extrai o nome do campo.
    const { name } = event.target;
    // Obtém o primeiro arquivo selecionado.
    const file = event.target.files?.[0];
    if (file) {
      // Processa o arquivo e obtém o resultado.
      const result = await processFile(file);
      // Atualiza os dados temporários com o resultado.
      setTempProfileData({ ...tempProfileData, [name]: result });
    }
  };

  const handleCancel = () => {
    // Reverte as alterações para os dados originais.
    setTempProfileData(data);
    setIsDialogOpen(false);
  };

  const processFile = (file: File): Promise<string | null> => {
    return new Promise((resolve, reject) => {
      // Cria um novo FileReader.
      const reader = new FileReader();
      // Define o que acontece quando a leitura do arquivo é concluída.
      reader.onloadend = () => {
        // Verifica se há um resultado da leitura.
        if (reader.result) {
          // Resolve a promessa com o resultado do arquivo.
          resolve(reader.result as string);
        } else {
          // Resolve com null se não houver resultado.
          resolve(null);
        }
      };

      // Rejeita a promessa em caso de erro.
      reader.onerror = () => reject("Error reading file");
      // Inicia a leitura do arquivo como uma data url.
      reader.readAsDataURL(file);
    });
  };

  return (
    <section className="flex flex-col items-center p-4">
      <div className="relative w-full max-w-lg">
        <img
          src={tempProfileData.cover}
          alt="Capa do Perfil"
          className="h-48 w-full rounded-lg object-cover"
        />
        <Avatar className="absolute -bottom-16 left-4 h-32 w-32 border-4 border-white dark:border-neutral-900">
          <AvatarImage src={tempProfileData.avatar} />
          <AvatarFallback>Account</AvatarFallback>
        </Avatar>
      </div>

      <h2 className="mt-16 text-2xl font-bold">{tempProfileData.name}</h2>
      <p className="mt-2 text-gray-600 dark:text-gray-300">
        {tempProfileData.bio}
      </p>

      <Button className="mt-4" onClick={() => setIsDialogOpen(true)}>
        Editar Perfil
      </Button>

      <h3 className="mt-8 text-xl font-semibold">Mangás Lidos</h3>
      <div className="mx-auto mt-2 flex w-full max-w-3xl justify-center">
        <Carousel
          className="w-1/2 max-w-sm"
          plugins={[Autoplay({ delay: 5000 })]}
        >
          <CarouselContent className="-ml-1">
            {Array.from({ length: 10 }).map((_, index) => (
              <CarouselItem
                key={index}
                className="pl-1 md:basis-1/2 lg:basis-1/3"
              >
                <div className="p-1">
                  <Card>
                    <CardContent className="flex aspect-square items-center justify-center p-6">
                      <span className="text-2xl font-semibold">
                        {index + 1}
                      </span>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>

      {/*
        fazer um action para o form do dialog
        Para o cover e avatar usar no form o: enctype="multipart/form-data"
        Usar o Form do Remix
        Arrumar os botões
        Arrumar as funções do inicio
      */}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogTitle>Editar Perfil</DialogTitle>
          <DialogDescription>
            Atualize suas informações de perfil.
          </DialogDescription>
          <Form {...form}>
            <form
              method="post"
              encType="multipart/form-data"
              className="space-y-4"
            >
              <input type="hidden" name="userId" value={data.userId} />
              <div>
                <Label htmlFor="cover">Escolher Capa</Label>
                <Input
                  type="file"
                  accept="image/*"
                  name="cover"
                  onChange={handleFileChange}
                  aria-label="Escolher Capa"
                />
              </div>
              <div>
                <Label htmlFor="avatar">Escolher Imagem do Perfil</Label>
                <Input
                  type="file"
                  accept="image/*"
                  name="avatar"
                  onChange={handleFileChange}
                  aria-label="Escolher Imagem do Perfil"
                />
              </div>
              <div>
                <Label htmlFor="name">Nome</Label>
                <Input
                  id="name"
                  name="name"
                  value={tempProfileData.name}
                  onChange={handleInputChange}
                  placeholder="Nome"
                  aria-label="Nome"
                />
              </div>
              <div>
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  name="bio"
                  value={tempProfileData.bio}
                  onChange={handleInputChange}
                  placeholder="Sobre você"
                  aria-label="Bio"
                />
              </div>
              <DialogFooter>
                <Button type="submit">Salvar</Button>
                <Button type="button" variant="outline" onClick={handleCancel}>
                  Cancelar
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </section>
  );
}
