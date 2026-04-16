import multer from "multer";
// Configuração do multer para armazenar 
// os arquivos enviados em uma pasta temporária
export const upload = multer({
    dest: "tmp/"
});