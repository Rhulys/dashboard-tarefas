# 📌 Dashboard de Tarefas com Previsão de Conclusão

Este é um sistema simples onde os usuários podem **adicionar tarefas, visualizar um gráfico de progresso e obter previsões de tempo de conclusão** com base em IA.

## 🚀 Funcionalidades

- Cadastro e Login com autenticação JWT 
- Adicionar, remover e concluir tarefas 
- IA para prever o tempo de conclusão das tarefas 
- Gráfico de progresso das tarefas 
- Interface responsiva e animada

---

## 🛠️ Tecnologias Utilizadas

### **Frontend**

- [Next.js](https://nextjs.org/) (React + SSR)
- [Apollo Client](https://www.apollographql.com/docs/react/) (GraphQL)
- [Tailwind CSS](https://tailwindcss.com/) (Estilização)
- [Framer Motion](https://www.framer.com/motion/) (Animações)

### **Backend**

- [Node.js](https://nodejs.org/) + [Express.js](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/) com [Mongoose](https://mongoosejs.com/)
- [Apollo Server](https://www.apollographql.com/docs/apollo-server/) (GraphQL)
- [TensorFlow.js](https://www.tensorflow.org/js) (IA para previsões)
- [JWT](https://jwt.io/) (Autenticação)

### **Deploy**

- **Backend:** [Railway](https://railway.app/)
- **Frontend:** [Vercel](https://vercel.com/)
- **Banco de Dados:** [MongoDB Atlas](https://www.mongodb.com/atlas)

---

## 📥 Instalação Local

### **1️⃣ Clonar o repositório**

```sh
git clone https://github.com/seu-usuario/dashboard-tarefas.git
cd dashboard-tarefas
```

### **2️⃣ Configurar o Backend**

```sh
cd backend
npm install
```

**Criar um arquivo ****\`\`**** com:**

```env
MONGO_URI=mongodb+srv://SEU_USUARIO:SEU_SENHA@cluster0.mongodb.net/dashboard-tarefas
JWT_SECRET=seu_segredo_super_secreto
```

Rodar o servidor:

```sh
node server.js
```

### **3️⃣ Configurar o Frontend**

```sh
cd ../dashboard-tarefas  # Pasta do frontend
npm install
```

**Criar um arquivo ****\`\`**** com:**

```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:4000/graphql
```

Rodar o frontend:

```sh
npm run dev
```

Agora acesse [**http://localhost:3000**](http://localhost:3000) 🎉

---

## 🚀 Deploy Online

### **Backend no Railway**

1️⃣ No Railway, conectar ao GitHub e selecionar `backend/`\
2️⃣ Adicionar variáveis de ambiente (`MONGO_URI`, `JWT_SECRET`)\
3️⃣ Deploy automático ativado! 🚀

### **Frontend no Vercel**

1️⃣ No Vercel, conectar ao GitHub e selecionar `dashboard-tarefas/`\
2️⃣ Adicionar variável `NEXT_PUBLIC_BACKEND_URL` com a URL do backend Railway\
3️⃣ Deploy automático ativado! 🚀

---

## 📌 Melhorias Futuras

- 📊 Melhorar os modelos de IA para previsões mais precisas
- 📱 Melhorar o design responsivo para dispositivos móveis
- 🔔 Adicionar notificações para status das tarefas

💡 **Sugestões são bem-vindas!**

---

## 📜 Licença

Este projeto está sob a MIT License - Veja [LICENSE](LICENSE) para mais detalhes.

🚀 **Feito com paixão e código!** 💙

