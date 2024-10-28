import fs from 'fs/promises';
import path from 'path';

// Define os tipos de arquivo permitidos para upload (tipos MIME de imagens)
export const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/jpg'];

export const uploadFile = async (file: File): Promise<string> => {
  // Verifica se o tipo do arquivo está na lista de tipos permitidos
  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    throw new Error(`Tipo de arquivo não suportado: ${file.type}`);
  }

  // Define o diretório de uploads na pasta pública do projeto
  const uploadsDir = path.resolve(process.cwd(), 'public/uploads');

  try {
    // Cria o diretório de uploads, caso ele ainda não exista
    await fs.mkdir(uploadsDir, { recursive: true });

    // Gera um nome de arquivo único usando o timestamp atual.
    // OBS: Timestamp é uma marcação de tempo específica em um determinado evento, indicando o momento exato em que algo aconteceu ou foi registrado.
    const timestamp = Date.now();
    // Só junta o timestamp com o nome do arquivo...
    const uniqueFilename = `${timestamp}-${file.name}`;
    // Parte desse arquivo usei o gpt pra dar uma ideia de estrutura, o fs e o path fui eu que escolhi pq achei interessante, mas como fiquei em duvida de umas coisas então o gpt deu um help, mas de certo modo, aqui ele usa o path para juntar o uploadsDir com o uniqueFilename.
    const filePath = path.join(uploadsDir, uniqueFilename);

    // Converte o arquivo para um buffer de dados (objeto usado para representar dados binários)
    const arrayBuffer = await file.arrayBuffer();
    // Cria um Buffer a partir do ArrayBuffer (manipula dados binários em Node.js)
    const buffer = Buffer.from(arrayBuffer);

     // Salva o buffer no caminho definido para o arquivo
    await fs.writeFile(filePath, buffer);

    // Retorna o caminho relativo do arquivo salvo para acesso público
    return `/uploads/${uniqueFilename}`;
  } catch (error) {
    // Exibe uma mensagem de erro no console e lança uma exceção se houver falha
    console.error('Erro ao fazer upload do arquivo:', error);
    throw new Error('Falha ao salvar o arquivo');
  }
};