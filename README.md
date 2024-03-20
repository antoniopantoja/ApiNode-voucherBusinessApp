# ApiNode-voucherBusinessApp
Essa API em Node.js usando o framework Express tem o objetivo de criar um sistema de autenticação e cadastro de usuários, além de oferecer uma rota para listar produtos com base no usuário logado. Aqui está uma descrição das principais funcionalidades:

#### 1. Configuração Inicial:

Usa o Express para criar o servidor.
Define a porta 3000 como padrão.
Carrega dados iniciais de um arquivo JSON.

#### 2. Rota de Autenticação (/auth/login):

Recebe um email e senha no corpo da requisição.
Verifica se o usuário existe e se a senha está correta usando bcrypt para verificar a senha hash.
Gera um token de acesso usando bcrypt.
Atualiza o token de acesso do usuário no arquivo JSON.

#### 3. Rota de Cadastro de Usuário (/users):

Recebe dados como documento, email, nome e uri no corpo da requisição.
Verifica se o usuário já está cadastrado.
Cria um novo usuário com senha hash e salva no arquivo JSON.

#### 4. Rota de Exclusão de Usuário (/users):

Recebe o id do usuário e o token de acesso no corpo da requisição.
Verifica se o token de acesso é válido para o usuário.
Remove o usuário do arquivo JSON.

#### 5. Rota de Atualização de Usuário (/users):

Recebe dados como id, documento, email, senha, nome, uri e token de acesso no corpo da requisição.
Verifica se o token de acesso é válido para o usuário.
Atualiza os dados do usuário no arquivo JSON.

#### 6. Rota de Listagem de Produtos (/allproducts):

Recebe o id do usuário e o token de acesso no corpo da requisição.
Verifica se o token de acesso é válido para o usuário.
Lista produtos e ofertas com base no id do usuário e retorna um objeto com as listas de produtos, ofertas, média e informações do usuário.
