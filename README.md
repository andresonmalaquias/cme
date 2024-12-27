# **Projeto CME**

**Sistema de gerenciamento de materiais médicos no CME (Central de Material e Esterilização), utilizando Python com Django Rest Framework para o desenvolvimento da API e React para o frontend.**

## **🚀 Configuração do Ambiente**

### **📥 Clonar o Repositório**

**Clone o repositório utilizando o comando abaixo:**

```bash
git clone https://github.com/andresonmalaquias/cme.git
```

### **⚙️ Variáveis de Ambiente**

**As variáveis de ambiente podem ser acessadas e modificadas no arquivo **``** localizado na raiz do projeto.**

### **🐳 Iniciar o Docker**

**Inicie os containers Docker com o comando:**

```bash
docker-compose up --build
```

### **📊 Executando Migrações**

**Aplique as migrações do banco de dados com o comando:**

```bash
docker exec -it cme_backend python manage.py migrate
```

## 🔑 **Usuário Padrão Criado**

Após configurar o ambiente, você pode acessar com as seguintes credenciais padrão:

- **Usuário:** `admin`
- **Senha:** `Senha123#`
