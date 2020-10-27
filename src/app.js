const express = require("express");
const cors = require("cors");
const { uuid, isUuid } = require('uuidv4')

// const { v4: uuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function validateRepositoryId(req, res, next) {
  const { id } = req.params
  if (!isUuid(id))
    return res.status(400).json({ error: 'Invalid repository ID.' })
  return next()
}
app.use('/projects/:id', validateRepositoryId)

app.get("/repositories", (request, response) => {
  return response.status(200).json(repositories)
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body
  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  }

  repositories.push(repository)

  // Certifique-se que o ID seja um UUID, e de sempre iniciar os likes como 0.

  return response.status(201).send(repository)
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params
  const { title, url, techs } = request.body

  const index = repositories.findIndex(repo => repo.id === id)
  if (index < 0) {
    return response.status(400).send({ error: "Repository not Found!" })
  }
  const oldRepo = repositories[index]
  const repository = { id, title, url, techs, likes: oldRepo.likes }
  repositories[index] = repository
  response.status(200).json(repository)

});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params

  const index = repositories.findIndex(repo => repo.id === id)
  if (index < 0) {
    return response.status(400).send({ error: "Repository not Found!" })
  }

  repositories.splice(index, 1)
  return response.status(204).send()
});

app.post("/repositories/:id/like", (request, response) => {
  // TODO
  const { id } = request.params
  const index = repositories.findIndex(repo => repo.id === id)
  if (index < 0) {
    return response.status(400).send({ error: "Repository not Found!" })
  }
  repositories[index].likes += 1
  return response.status(200).send(repositories[index])
});

module.exports = app;
