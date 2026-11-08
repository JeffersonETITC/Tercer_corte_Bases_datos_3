# Actividad 1 - API REST con Express, TypeScript y MongoDB Atlas

Proyecto creado a partir de `scaffold.sh` de la actividad. Contiene CRUD funcional del recurso `demo` y un archivo `requests.http` para las pruebas.

**EMPIEZA AQUÍ:** abre [GUIA_PASO_A_PASO.md](GUIA_PASO_A_PASO.md).

```bash
npm install
# Copia .env.example a .env y configura MONGO_URI con credenciales de Atlas
npm run dev
```

Ruta de prueba: `http://localhost:3000/health`.

CRUD: `POST`, `GET`, `GET /:id`, `PUT /:id`, `DELETE /:id` en `/api/v1/demo`.
