# 📚 Quantum Mangás - API Tasks

Este documento detalha as tarefas relacionadas à integração com a API da MangaDex e o desenvolvimento de componentes na aplicação _index.tsx.

## 🛠️ Tarefas de Desenvolvimento

### Funcionalidades da API

| Função             | Status      | Observações                                                             |
| ------------------ | ----------- | ----------------------------------------------------------------------- |
| **Pegar Título**   | ✅ Feito     | Implementado no `loader`, exibição correta na interface.                |
| **Pegar Status**   | ✅ Feito     | Implementado no `loader`, exibição correta na interface.                |
| **Pegar Autor**    | ✅ Feito  | Implementado, nome do autor é exibido corretamente.              |
| **Pegar Capítulo** | ✅ Feito  | Implementado, capítulos são exibidos corretamente. |
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

1. **Nada Por Enquanto**
