import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { mainRoutes } from "./routes/main";
import { authRoutes } from "./routes/auth";
import { adminRoutes } from "./routes/admin";

require("dotenv").config();

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
//definindo as rotas da API com mainRoutes
server.use("/api", mainRoutes);
server.use("/api/admin", adminRoutes);
server.use("/api/auth", authRoutes);

//iniciando o servidor na porta 4444
server.listen(4444, () => {
    console.log("The Big Blog is running on port 4444");
    console.log(process.env.DATABASE_URL);
});
