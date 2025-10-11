# Configuração de Variáveis de Ambiente

Este projeto utiliza variáveis de ambiente para configurar a URL do backend, permitindo que você altere facilmente a URL sem precisar editar o código.

## Arquivos de Configuração

### `.env.example`
Este arquivo serve como template e contém todas as variáveis de ambiente necessárias com valores padrão.

### `.env.local`
Este arquivo contém suas configurações locais e não deve ser commitado no repositório.

## Variáveis Disponíveis

| Variável | Descrição | Valor Padrão |
|----------|-----------|--------------|
| `NEXT_PUBLIC_API_URL` | URL base do backend | `http://localhost:8000` |
| `NODE_ENV` | Ambiente de execução | `development` |

## Como Usar

### 1. Configuração Inicial
```bash
# Copie o arquivo de exemplo
cp .env.example .env.local

# Edite o arquivo com suas configurações
nano .env.local
```

### 2. Para Desenvolvimento Local
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NODE_ENV=development
```

### 3. Para Produção/Deploy
```env
NEXT_PUBLIC_API_URL=https://seu-backend.com
NODE_ENV=production
```

### 4. Para Testes com Backend Diferente
```env
NEXT_PUBLIC_API_URL=http://192.168.1.100:8000
NODE_ENV=development
```

## Como Funciona

O projeto utiliza um serviço de configuração centralizado (`src/lib/config.ts`) que:

1. Lê as variáveis de ambiente
2. Fornece valores padrão caso as variáveis não estejam definidas
3. Centraliza toda a lógica de configuração
4. Facilita testes e mudanças de ambiente

## Exemplos de Uso no Código

```typescript
import { getApiUrl, getApiEndpoint } from '@/lib/config';

// Obter URL base da API
const apiUrl = getApiUrl(); // http://localhost:8000

// Obter endpoint específico
const audioEndpoint = getApiEndpoint('/audio'); // http://localhost:8000/audio
const authEndpoint = getApiEndpoint('/accounts'); // http://localhost:8000/accounts
```

## Deploy

Para deploy em produção, você pode:

1. **Definir variáveis de ambiente no servidor**
2. **Usar arquivos de configuração específicos do ambiente**
3. **Configurar através do painel de controle do provedor de hospedagem**

### Exemplo para Vercel
```bash
vercel env add NEXT_PUBLIC_API_URL
# Digite: https://seu-backend.com
```

### Exemplo para Netlify
No painel do Netlify, vá em Site settings > Environment variables e adicione:
- `NEXT_PUBLIC_API_URL` = `https://seu-backend.com`

## Troubleshooting

### Problema: API não conecta
- Verifique se `NEXT_PUBLIC_API_URL` está definida corretamente
- Confirme se o backend está rodando na URL especificada
- Verifique se não há problemas de CORS

### Problema: Variáveis não são carregadas
- Certifique-se de que o arquivo `.env.local` está na raiz do projeto
- Reinicie o servidor de desenvolvimento após alterar variáveis
- Verifique se as variáveis começam com `NEXT_PUBLIC_` para serem acessíveis no cliente
