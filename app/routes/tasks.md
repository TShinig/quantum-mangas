# 📚 Quantum Mangás - API Tasks

Este documento detalha as tarefas relacionadas à integração com a API da MangaDex e o desenvolvimento de componentes na aplicação _index.tsx.

## 🛠️ Tarefas de Desenvolvimento

### Funcionalidades da API

| Função             | Status      | Observações                                                             |
| ------------------ | ----------- | ----------------------------------------------------------------------- |
| **Pegar Título**   | ✅ Feito     | Implementado no `loader`, exibição correta na interface.                |
| **Pegar Status**   | ✅ Feito     | Implementado no `loader`, exibição correta na interface.                |
| **Pegar Autor**    | ❌ Não Feito | Requer implementação para buscar e exibir o nome do autor.              |
| **Pegar Capítulo** | ❌ Não Feito | Implementar busca e exibição de capítulos usando o endpoint apropriado. |
| **Pegar Capa**     | ✅ Feito     | Implementado no `loader`, utilizando a lógica de busca de capa correta. |
| **Pegar Tags**     | ✅ Feito     | Implementado no `loader`, exibição correta na interface.                |

### 🌐 Endpoints

- **Manga:**  
  - Endpoint: [`https://api.mangadex.org/manga`](https://api.mangadex.org/manga)  
  - Status: ✅ Implementado
- **Capa:**  
  - Endpoint: [`https://api.mangadex.org/cover`](https://api.mangadex.org/cover)  
  - Status: ✅ Implementado
- **Autor:**  
  - Endpoint: [`https://api.mangadex.org/author`](https://api.mangadex.org/author)  
  - Status: ✅ Implementado

### 📝 Observações

- **Interfaces no Postman:**  
  Utilize o Postman para realizar uma requisição a uma das APIs (por exemplo, [`https://api.mangadex.org/manga`](https://api.mangadex.org/manga)), copie a resposta JSON e cole em um arquivo separado (`.json`).  
  Em seguida, solicite ao ChatGPT que gere as interfaces TypeScript com base no conteúdo desse arquivo JSON.

- **Estilos de Interface:**  
  - **Design de Cards:**  
    Implementado na aplicação utilizando estilos para melhorar a apresentação visual.

## 🚀 Próximos Passos

1. **Implementar a busca de Autor:**
   - Atualizar o `loader` para buscar informações do autor usando o endpoint `/author`.
   - Mapear a resposta para incluir o nome do autor na interface.
  
2. **Implementar a exibição de Capítulos:**
   - Integrar o endpoint `/chapter` para buscar capítulos disponíveis.
   - Atualizar a interface para exibir a lista de capítulos.

3. **Refinar o Design e Usabilidade:**
   - Revisar estilos CSS para melhorar a responsividade.
