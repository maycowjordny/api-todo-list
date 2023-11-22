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

      if (!name) {
        return res.writeHead(400).end(
          JSON.stringify({
            error: "Name is required field.",
          })
        );
      }

      if (!description) {
        return res.writeHead(400).end(
          JSON.stringify({
            error: "Description is required field.",
          })
        );
      }

      const task = {
        id: randomUUID(),
        name,
        description,
        completed_at: null,
        created_at: new Date(),
        updated_at: new Date(),
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

      if (!id) {
        return res.writeHead(404).end(
          JSON.stringify({
            error: "Task not found.",
          })
        );
      }

      if (!name) {
        return res.writeHead(400).end(
          JSON.stringify({
            error: "Name is required field.",
          })
        );
      }

      if (!description) {
        return res.writeHead(400).end(
          JSON.stringify({
            error: "Description is required field.",
          })
        );
      }

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

      if (!id) {
        return res.writeHead(404).end(
          JSON.stringify({
            error: "Task not found.",
          })
        );
      }

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

      if (!id) {
        return res.writeHead(404).end(
          JSON.stringify({
            error: "Task not found.",
          })
        );
      }

      database.delete("task", id);

      return res.writeHead(204).end();
    },
  },
];
