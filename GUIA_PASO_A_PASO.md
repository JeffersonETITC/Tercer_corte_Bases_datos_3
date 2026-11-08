# Guía detallada: Actividad 1 - API REST y MongoDB Atlas

## 1. Qué contiene el proyecto

Este ZIP se generó usando el archivo `scaffold.sh` facilitado en la actividad y conserva un módulo `demo` con CRUD. La estructura es `src/api/v1` (rutas principales), `src/modules/demo` (modelos, rutas, controladores, servicios y repositorios), `src/config` (variables y base de datos), `src/shared` (errores) y `src/app.ts` + `src/server.ts` (servidor).

Flujo: cliente HTTP → rutas → controlador → servicio → repositorio → MongoDB Atlas.

## 2. Requisitos previos

- Instalar Node.js LTS (preferentemente Node.js 22 o posterior) desde https://nodejs.org/. Incluye npm.
- Instalar Visual Studio Code desde https://code.visualstudio.com/.
- Tener conexión a Internet para instalar los paquetes y conectar a Atlas.
- Crear una cuenta en https://www.mongodb.com/atlas/database (puede usar el plan gratuito donde esté disponible).
- Opcional: instalar en VS Code la extensión **REST Client** para ejecutar `requests.http` y **MongoDB for VS Code** para consultar colecciones.

En una terminal ejecutar: `node -v` y `npm -v`. Si no se reconocen, reinstalar Node.js y abrir otra terminal.

## 3. Preparar el ZIP en Visual Studio Code

1. Descargar el ZIP y descomprimirlo en una carpeta local (por ejemplo `Documentos/actividad1-api`).
2. Abrir VS Code → **Archivo > Abrir carpeta** → seleccionar `actividad1-api`.
3. Ir a **Terminal > Nueva terminal**. La terminal debe estar situada en la carpeta que contiene `package.json`.
4. Ejecutar `npm install` (descarga las dependencias y crea `node_modules`).
5. Copiar `.env.example` a `.env`. En Windows PowerShell: `Copy-Item .env.example .env`; en macOS/Linux: `cp .env.example .env`.
6. Editar `.env` para introducir la URI verdadera de MongoDB Atlas. **Nunca compartir `.env` ni subirlo a un repositorio público.**

## 4. Crear y configurar MongoDB Atlas

1. Entrar en https://cloud.mongodb.com/ y crear un proyecto, si aún no existe.
2. Crear un clúster: **Database / Clusters / Build a Database** (el nombre de las opciones puede variar según la interfaz). Elegir un plan apto para pruebas, por ejemplo el gratuito si está disponible. Esperar a que figure listo.
3. Abrir **Security / Database Access** y seleccionar **Add New Database User**. Elegir autenticación con contraseña; crear un nombre de usuario y una contraseña fuerte. Asignar permisos de lectura/escritura limitados a la base de datos de la práctica cuando la interfaz lo permita. **El usuario de base de datos NO es el usuario de acceso a Atlas.**
4. Abrir **Security / Network Access / IP Access List** → **Add IP Address** → añadir la IP pública actual de tu equipo. Si tu IP cambia, actualizar la lista. Evita permitir `0.0.0.0/0` para trabajos reales; esto abre el acceso de red desde cualquier IP.
5. Volver a **Database / Clusters**, pulsar **Connect** en el clúster y seleccionar **Drivers**. Elegir **Node.js** y copiar el texto de conexión que comienza por `mongodb+srv://`.
6. Reemplazar el usuario y la contraseña en la URI. Si la contraseña contiene `@`, `:`, `/`, `?`, `#`, `[`, `]`, `%` u otros caracteres especiales, codificarlos como parte de la URL (por ejemplo, `@` es `%40`; no codificar toda la URI).
7. Guardar la URI en `.env`. Ejemplo inventado (NO es una conexión real):

```dotenv
PORT=3000
NODE_ENV=development
MONGO_URI=mongodb+srv://usuario:contrasena@cluster0.ejemplo.mongodb.net/?retryWrites=true&w=majority
MONGO_DB_NAME=actividad1_db
```

8. No hay que crear a mano la colección `demo`: MongoDB la crea al insertar el primer registro, si el usuario tiene permiso.

## 5. Ejecutar y comprobar el servidor

En la terminal de VS Code:

```bash
npm run check
npm run dev
```

Cuando la conexión a Atlas sea exitosa, la terminal mostrará mensajes similares a:

```text
Conectado a MongoDB (db: actividad1_db)
Servidor corriendo en el puerto 3000 [development]
```

Abrir http://localhost:3000/health: debe responder un JSON con `status: "ok"`. Abrir http://localhost:3000/api/v1/demo: al inicio debe mostrar `[]`. **Importante:** estos mensajes son resultados esperados, no pruebas de que esta entrega ya esté conectada a tu cuenta Atlas.

## 6. Probar CRUD en el mismo VS Code

Instalar extensión **REST Client**, abrir `requests.http` y pulsar **Send Request** sobre cada petición. En orden:

1. `GET /health` comprueba el servidor.
2. `POST /api/v1/demo` crea un documento con `name`, `description` y `active`. Copiar el valor `_id` de la respuesta.
3. `GET /api/v1/demo` lista documentos.
4. Sustituir `ID_REAL` por el `_id` recibido y ejecutar `GET /api/v1/demo/ID_REAL`.
5. Ejecutar `PUT /api/v1/demo/ID_REAL` para modificar los datos.
6. Ejecutar `DELETE /api/v1/demo/ID_REAL` para eliminarlo. El servidor devuelve HTTP 204 sin cuerpo cuando funciona.

También pueden probarse estas rutas usando Postman o Insomnia.

## 7. Verificar los datos directamente en Atlas

En el clúster elegir **Browse Collections** (o **Collections**) → base `actividad1_db` → colección `demo`. Tras la petición POST aparecerá el documento. Actualizar la vista si es necesario. Tras DELETE ya no debe aparecer.

## 8. Errores frecuentes y soluciones

- `MongoServerSelectionError` / timeout: revisar IP en **Network Access**, URI, conexión de Internet, firewall y disponibilidad del clúster.
- `bad auth` / `Authentication failed`: revisar el usuario de **Database Access**, la contraseña y la codificación de caracteres especiales.
- `querySrv ENOTFOUND`: verificar el nombre del clúster y que la red permita resolver DNS SRV.
- `Falta la variable MONGO_URI`: verificar que `.env` esté en la misma carpeta que `package.json`.
- `EADDRINUSE` en 3000: cambiar `PORT=3001` en `.env` o cerrar el proceso anterior.
- `npm` no se reconoce: instalar Node.js o reiniciar VS Code después de instalarlo.
- Error 400 al enviar el POST: confirmar `Content-Type: application/json` y que `name` y `description` sean textos no vacíos.
- Error 404 al consultar por id: usar un `_id` que realmente exista y copiarlo completo (24 caracteres hexadecimales).

## 9. Compilación y puesta en marcha

Para comprobar TypeScript: `npm run check`. Para compilar: `npm run build`. Para ejecutar el resultado: `npm start`. No usar `npm start` sin ejecutar antes `npm run build`. La API no incluye interfaz web; se utiliza desde peticiones HTTP.

## 10. Cómo se creó el proyecto

1. Se inspeccionó el material de la actividad y el script de origen.
2. Se ejecutó `scaffold.sh`, respondiendo `actividad1-api` al nombre del proyecto.
3. Se conservaron los archivos generados para el servidor Express y el CRUD `demo`.
4. Se añadió el tipo de Node.js (`@types/node`) como dependencia de desarrollo, necesaria para el uso tipado de `process`.
5. Se añadió `requests.http`, recomendaciones de extensiones y esta guía.
6. Se preparó `.env.example` con valores de referencia sin credenciales.
7. Se comprimió la carpeta del proyecto en un ZIP, excluyendo `.env`, `node_modules` y artefactos de compilación.

**Limitación de verificación:** el ZIP no puede tener una conexión funcional a TU Atlas hasta que configures tu clúster, usuario, IP autorizada y URI. La instalación de dependencias y las pruebas contra MongoDB requieren conectividad a esos servicios.
