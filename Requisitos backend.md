## Resources:				     

|<br />- Post:<br />-- id int<br />-- slug<br />-- status enum PUBLISHED \| DRAFT @default(DRAFT)<br />-- title<br />-- body<br />-- createdAt @default(now())<br />-- updatedAt?<br />-- cover<br />-- authorId<br />-- tags|- User:<br />-- id int<br />-- status boolean @default(true)<br />-- name<br />-- email @unique<br />-- password|
|-|-|



## Endpoints:



|- GET /posts (Listagem dos posts, com paginação)<br />-- Requisição:<br />--- Querystring: ?page=4<br />-- Resposta:<br />{<br />    posts: \[<br />        { id, title, createdAt, cover, authorName, tags, slug }<br />    ],<br />    page: 1<br />}<br /><br />- GET /posts/:slug (Um post específico)<br />-- Resposta:<br />{<br />    post: { id, title, createdAt, cover, authorName, tags, body, slug }<br />}<br /><br />- GET /posts/:slug/related (Posts relacionados = tags similares)<br />-- Resposta:<br />{<br />    posts: \[<br />        { id, title, createdAt, cover, authorName, tags, slug }<br />    ]<br />}<br /><br />- POST /auth/signup (Cadastro)<br />-- Requisição:<br />--- Body: { name, email, password }<br />-- Resposta: 201<br />{<br />    user: { id, name, email }<br />    token: 'abc'<br />}<br /><br />- POST /auth/signin (Login)<br />-- Requisição:<br />--- Body: { email, password }<br />-- Resposta:<br />{<br />    user: { id, name, email },<br />    token: 'abc'<br />}<br /><br />- POST /auth/validate (Validar JWT)<br />-- Requisição:<br />--- Header Authorization: Bearer abc<br />-- Resposta:<br />{<br />    user: { id, name, email }<br />}|- GET /admin/posts (Pegar posts, incluindo drafts, com paginação)<br />-- Requisição:<br />--- Header Authorization: Bearer abc<br />--- Querystring: ?page=4<br />-- Resposta:<br />{<br />    posts: \[<br />        { id, status, title, createdAt, cover, authorName, tags, slug }<br />    ],<br />    page: 1<br />}<br /><br />- GET /admin/posts/:slug (Pegar um post)<br />-- Requisição:<br />--- Header Authorization: Bearer abc<br />-- Resposta:<br />{<br />    post: { id, title, createdAt, cover, authorName, tags, body, slug}<br />}<br /><br />- POST /admin/posts (Inserir um novo post)<br />-- Requisição:<br />--- FormData multipart/form-data<br />--- Header Authorization: Bearer abc<br />--- Body: { status, title, tags, body, cover: FILE }<br />-- Resposta: 201<br />{<br />    post: { id, status, title, createdAt, cover, authorName, tags, slug }<br />}<br /><br />- PUT /admin/posts/:slug (Editar um post)<br />-- Requisição:<br />--- FormData multipart/form-data<br />--- Header Authorization: Bearer abc<br />--- Body: { status, title, tags, body, cover: FILE }<br />-- Resposta:<br />{<br />    post: { id, status, title, createdAt, cover, authorName, tags, slug }<br />}<br /><br />- DELETE /admin/posts/:slug (Deletar um post)<br />-- Requisição:<br />--- Header Authorization: Bearer abc<br />-- Resposta:<br />{<br />    error: null<br />}|
|-|-|







