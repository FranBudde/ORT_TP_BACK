# 💸 Gestor de Gastos API

Una API RESTful para la gestión de gastos personales, usuarios y transacciones. Desarrollada con Node.js, Express y MongoDB, y protegida con autenticación JWT.

---

## 🚀 Tecnologías utilizadas

- **Node.js**
- **Express.js**
- **MongoDB (Mongoose)**
- **JWT (JSON Web Token)**

---

## 📦 Instalación

1. Cloná el repositorio:
   ```bash
   git clone https://github.com/FranBudde/ORT_TP_BACK.git
   cd ORT_TP_BACK
   code .
   ```


2. Instalá las dependencias:
   ```bash
   npm install
   ```

3. Configurá el archivo `.env`:
   ```env
   PORT=3000
   MONGO_URI=tu_uri_de_mongodb
   JWT_SECRET=tu_clave_secreta
   ```

4. Iniciá el servidor:
   ```bash
   npm run dev
   ```

---

## 🔐 Autenticación

Todas las rutas están protegidas mediante **JWT**.

### 🔑 Flujo de autenticación:
1. **Registro** mediante `/api/user/insert_user`
2. **Login** mediante `/api/user/login`
3. El endpoint de login devuelve un **token JWT**
4. Este token debe enviarse en el header de cada request protegido:

```
Authorization: Bearer <tu_token>
```

---

## 📚 Endpoints disponibles

### 👤 Usuarios

| Método | Endpoint                      | Descripción |
|--------|-------------------------------|-------------|
| GET    | `/api/user/get_users`         | Devuelve todos los usuarios creados en la base de datos |
| POST   | `/api/user/login`             | Login de usuario, devuelve un JWT |
| POST   | `/api/user/insert_user`       | Inserta un nuevo usuario y crea su balance inicial |
| DELETE | `/api/user/delete_user`       | Elimina al usuario de la base de datos junto con sus transacciones |

---

### 💳 Transacciones

| Método | Endpoint                               | Descripción |
|--------|----------------------------------------|-------------|
| POST   | `/api/transactions/update_balance`     | Actualiza el balance total de un usuario |
| POST   | `/api/transactions/create_transaccion` | Crea una nueva transacción |
| GET    | `/api/transactions/get_transaccions`   | Devuelve una lista de transacciones |

---

## 📌 Estado del proyecto

✅ Módulo de usuarios  
✅ Módulo de transacciones  
🔒 Autenticación JWT implementada  
🚧 Validaciones y manejo de errores en progreso

---

## 🧑‍💻 Equipo de desarrollo

    - Francisco Buddemeyer Izzo
    - Santiago Khazki
    - Gabriella Vargas
    - Ian Graus
    - Rodrigo Alcalde

---


## 📥 Ejemplos de Requests

### 🧾 Login de Usuario

**POST** `/api/user/login`

```json
{
  "username": "",
  "password": ""
}
```

### 🧾 Registro de Usuario

**POST** `/api/user/insert_user`

```json
{
  "firstName": "",
  "lastName": "",
  "userName": "",
  "password": ""
}
```
---

### 🧾 Crear Transacción

**POST** `/api/transactions/create_transaccion`

```json
{
  "id_user": "",
  "id_categoria": "",
  "amount": ,
  "comment": ""
}
```

> ⚠️ Recordá incluir el header:

## 📃 Licencia

ORT Licencia 