import { randomUUID } from "node:crypto";
import { Database } from "./database.js";
import { buildRoutePath } from "./utils/build-route-path.js";

const database = new Database();

export const routes = [
  {
    method: "GET",
    path: buildRoutePath("/task"),
    handler: (req, res) => {
      const { search } = req.query;

      const task = database.select(
        "task",
        search
          ? {
              name: search,
            }
          : null
      );

      return res.end(JSON.stringify(task));
    },
  },
  {
    method: "POST",
    path: buildRoutePath("/task"),
    handler: (req, res) => {
      const { name, description } = req.body;

      const task = {
        id: randomUUID(),
        name,
        description,
        completed_at: null,
        created_at: new Date(),
      };

      database.insert("task", task);

      return res.writeHead(201).end();
    },
  },
  {
    method: "PUT",
    path: buildRoutePath("/task/:id"),
    handler: (req, res) => {
      const { id } = req.params;
      const { name, description } = req.body;

      database.update("task", id, {
        name,
        description,
        updated_at: new Date(),
      });

      return res.writeHead(204).end();
    },
  },
  {
    method: "PATCH",
    path: buildRoutePath("/task/:id/complete"),
    handler: (req, res) => {
      const { id } = req.params;
      const { completed_at } = req.body;

      database.update("task", id, {
        completed_at,
      });

      return res.writeHead(204).end();
    },
  },
  {
    method: "DELETE",
    path: buildRoutePath("/task/:id"),
    handler: (req, res) => {
      const { id } = req.params;

      database.delete("task", id);

      return res.writeHead(204).end();
    },
  },
];
