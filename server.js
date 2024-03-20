const express = require('express');
const fsa = require('fs');
const bcrypt = require('bcrypt');

const app = express();
const PORT = 3000;
const DATA_FILE_PATH = './data.json';

let data = {};

loadData();

app.use(express.json());

function loadData() {
  fsa.readFile(DATA_FILE_PATH, 'utf8', (err, jsonData) => {
    if (err) {
      console.error(err);
      return;
    }
    data = JSON.parse(jsonData);
  });
}

function saveData() {
  fsa.writeFile(DATA_FILE_PATH, JSON.stringify(data, null, 2), err => {
    if (err) {
      console.error(err);
      return;
    }
    console.log('Dados salvos com sucesso.');
  });
}
// Rota para autenticação
app.post('/auth/login', async (req, res) => {
  const { email, password } = req.body;
  console.log('/auth/login');
  const user = data.users.find(u => u.email === email);
  if(user === undefined){
    return res.status(400).send({ error: 'Usuário Não Encontrado !' });
  }
  const id = user.id;
  if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).send({ error: 'Usuário ou senha inválidos !' });
  }
  const token = await bcrypt.hash('voucherBusinessApp', 10);
  const userIndex = data.users.findIndex(user => user.id === parseInt(id));
  // Alterar o TokenAccess
  data.users[userIndex].TokenAccess = token;
  saveData();
  res.send({ id: id, token: token });
});
// Rota para Cadastro de usuário
app.post('/users', async (req, res) => {
  const { documento, email, nome, uri } = req.body;

  const existingUser = data.users.find(u => u.email === email);
  if (existingUser) {
    return res.status(400).send({ error: 'Usuário já cadastrado' });
  }

  const hashedPassword = await bcrypt.hash('1234', 10);
  const newUser = { id: data.users.length + 1, nome: nome, documento: documento, email: email, password: hashedPassword, uri: uri, pontuacao: 0, pontuacaoRecebida: 0, pontuacaoDistribuida: 0, TokenAccess: "" };
  data.users.push(newUser);

  saveData();

  res.status(201).send({ id: newUser.id, message: 'Cadastro com Sucesso!' });
});

// Rota para Delete usuário
app.delete('/users', (req, res) => {
  const { id, TokenAccess } = req.body;
  const checked = data.users.findIndex(user => user.id === id && user.TokenAccess === TokenAccess);

  if(checked === -1){
    return res.status(404).json({ error: 'token invalido' });
  }else{
  const userIndex = data.users.findIndex(user => user.id === parseInt(id));
  if (userIndex === -1) {
    return res.status(404).json({ error: 'Usuário não encontrado' });
  }

  data.users.splice(userIndex, 1);

  saveData();

  res.status(201).send({message: 'Deletado com Sucesso!'});
  }
});
// Rota para atualizar um usuário
app.put('/users', async (req, res) => {
  const { id, documento, email, password, nome, uri, TokenAccess } = req.body;
  const checked = data.users.findIndex(user => user.id === id && user.TokenAccess === TokenAccess);

  if(checked === -1){
    return res.status(404).json({ error: 'token invalido' });
  }else{

    const userIndex = data.users.findIndex(user => user.id === parseInt(id));
    if (userIndex === -1) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    if(password != ""){
      data.users[userIndex].password = hashedPassword;
      }
    data.users[userIndex].email = email;
    data.users[userIndex].nome = nome;
    data.users[userIndex].documento = documento;
    if(uri != ""){
    data.users[userIndex].uri = uri;
    }
  
    saveData();
  
    res.status(200).send({ id: id, message: 'dados Atualizado com Sucesso!' });
  }
});
// Rota para Lista produtos
app.post('/allproducts', (req, res) => {
  const { id, TokenAccess } = req.body;
  console.log('/allproducts', req.body);
  const checked = data.users.findIndex(user => user.id === id  && user.TokenAccess === TokenAccess);
  console.log('checked', checked);
  let result = {};

  if(checked === -1){
    return res.status(404).json({ error: 'token invalido' });
  }else{
  if (id === 1) {
    result = {
          produtos: data.produtos.filter(produto => produto.id <= 6),
          ofertas: data.ofertas.filter(oferta => oferta.id <= 6),
          media: data.media,
          usuario: data.users.filter(users => users.id == 1)
      };
  } else if (id === 2) {
    result = {
          produtos: data.produtos.filter(produto => produto.id > 6),
          ofertas: data.ofertas.filter(oferta => oferta.id > 6),
          media: data.media,
          usuario: data.users.filter(users => users.id = 2)
      };
  } else {
      return res.status(400).json({ message: 'Usuário não encontrado' });
  }

  res.json(result);
  }
});


app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
