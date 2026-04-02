import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
//criando o servidor
const server = express();
//habilitando o CORS para permitir requisições de outros domínios
server.use(cors());
//habilitando o body-parser para processar os dados enviados no corpo das requisições
server.use(bodyParser.json());
//habilitando o body-parser para processar os dados enviados no corpo das requisições em formato URL-encoded
server.use(bodyParser.urlencoded({ extended: true }));
//habilitando a pasta public para servir arquivos estáticos
server.use(express.static("public"));

server.get("/ping", (req, res) => {
  res.json({ pong: true });
});

//iniciando o servidor na porta 4444
server.listen(4444, () => {
    console.log("The Big Blog is running on port 4444");
});
