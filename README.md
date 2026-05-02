# API REST de juegos de mesa

Proyecto de Express para manejar una coleccion compartida de juegos de mesa.
Los datos se guardan en memoria, asi que se mantienen solo mientras el servidor esta encendido.

## Instalacion

```bash
npm install
```

## Ejecutar el servidor

```bash
npm start
```

Tambien se puede usar el modo de desarrollo:

```bash
npm run dev
```

Por defecto el servidor corre en:

```text
http://localhost:3000
```

## Endpoints

| Metodo | Ruta | Descripcion |
| --- | --- | --- |
| GET | `/api/games` | Consultar todos los juegos |
| GET | `/api/games?name=catan` | Buscar juegos por nombre |
| GET | `/api/games/:id` | Buscar un juego por id |
| POST | `/api/games` | Crear un juego |
| PUT | `/api/games/:id` | Actualizar un juego |
| PATCH | `/api/games/:id` | Actualizar algunos campos de un juego |
| DELETE | `/api/games/:id` | Eliminar un juego |

## Ejemplo para crear un juego

POST `/api/games`

```json
{
  "id": "azul",
  "name": "Azul",
  "minPlayers": 2,
  "maxPlayers": 4,
  "avgDurationMinutes": 45,
  "acquiredDate": "20-04-2025",
  "condition": "perfect"
}
```

## Ejemplo para actualizar un juego

PUT `/api/games/azul`

```json
{
  "name": "Azul",
  "minPlayers": 2,
  "maxPlayers": 4,
  "avgDurationMinutes": 40,
  "acquiredDate": "20-04-2025",
  "condition": "lightly_used"
}
```

## Ejemplo para actualizar solo algunos campos

PATCH `/api/games/azul`

```json
{
  "condition": "damaged"
}
```

## Valores permitidos para condition

- `perfect`
- `lightly_used`
- `worn`
- `damaged`

## Formato de fecha

La fecha de adquisicion debe escribirse como `DD-MM-YYYY`.

Ejemplo correcto:

```json
"acquiredDate": "20-04-2025"
```

Ejemplos incorrectos:

```json
"acquiredDate": "04-2025-20"
```

```json
"acquiredDate": "2025-04-20"
```

## Codigos de respuesta usados

- `200`: consulta, actualizacion o eliminacion correcta.
- `201`: juego creado correctamente.
- `400`: datos invalidos.
- `404`: juego no encontrado.
- `409`: id duplicado al crear.

## Nota sobre los datos

No se usa base de datos ni archivos para guardar informacion. Si el servidor se apaga, los juegos creados durante esa ejecucion se pierden.
