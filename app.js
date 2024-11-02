//aqui importamos todas las librerias necesarias
const express = require ("express");
const bodyParser = require("body-parser");
const app = express();
const mysql = require ("mysql2");
const { Sequelize, DataTypes } = require("sequelize");
const jwt = require("jsonwebtoken");
const PORT = 3000;

app.use(bodyParser.json());
//esto crea un token 
const SECRET_KEY = "tu_clave_secreta";

//midleware para generar claves
function autenticarToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Obtener el token del encabezado

  if (!token) return res.status(401).json({ error: "Token requerido" });

  jwt.verify(token, SECRET_KEY, (err, usuario) => {
    if (err) return res.status(403).json({ error: "Token inválido" });
    req.usuario = usuario;
    next();
  });
}

// Ejemplo de ruta protegida
app.get("/api/protected", autenticarToken, (req, res) => {
  res.json({ message: "Acceso autorizado" });
});


// Configuración de la conexión de Sequelize con MySQL
const sequelize = new Sequelize("db_tienda", "administrador", "contraseña", {
  host: "localhost",
  dialect: "mysql",
});

// Verificar la conexión con la base de datos
sequelize.authenticate()
  .then(() => console.log("Conectado a MySQL con Sequelize"))
  .catch((error) => console.error("Error al conectar con MySQL:", error));


//aqui hacemos el metodo para crear el carrito
  // Definir el modelo de Producto
const Producto = sequelize.define("Producto", {
  id_producto: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  precio: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  tableName: 'productos',
  timestamps: false,
});

// hacemos lo mismo con la tabla de Carrito
const Carrito = sequelize.define("Carrito", {
  producto_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Producto,
      key: 'id_producto',
    },
  },
  cantidad: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
  },
}, {
  tableName: 'carrito',
  timestamps: false,
});

// Ruta para agregar producto al carrito
app.post("/api/cart", async (req, res) => {
  const { id_producto } = req.body;
  
  try {
    const objeto = await Carrito.findOne({ where: { producto_id: id_producto } });
    
    if (objeto) {
      await objeto.increment("cantidad");
    } else {
      await Carrito.create({ producto_id: id_producto });
    }
    res.json({ message: "Producto agregado al carrito" });
  } catch (error) {
    console.error("Error al agregar producto al carrito:", error);
    res.status(500).json({ error: "Error al agregar el producto al carrito" });
  }
});

// Ruta para obtener los productos del carrito
app.get("/api/cart", async (req, res) => {
  try {
    const objetos = await Carrito.findAll({
      include: {
        model: Producto,
        attributes: ["nombre", "precio"],
      },
    });

    const carritoConTotal = objetos.map(objeto => ({
      id_producto: objeto.producto_id,
      nombre: objeto.Producto.nombre,
      precio: objeto.Producto.precio,
      cantidad: objeto.cantidad,
      total: objeto.Producto.precio * objeto.cantidad,
    }));

    res.json(carritoConTotal);
  } catch (error) {
    console.error("Error al obtener productos del carrito:", error);
    res.status(500).json({ error: "Error al obtener los productos del carrito" });
  }
});

//desde aqui empezamos el trabajo para los usuarios de la tienda
//aqui hacemos todos los metodos para el usuario y la contraseña
const Usuario = sequelize.define("Usuario", {
  usuario: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  contraseña: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  tableName: 'usuarios',
  timestamps: false,
});

// Sincronizar ambos modelos
sequelize.sync();

// Ruta para registrar un usuario
app.post("/api/register", async (req, res) => {
  const { usuario, contraseña } = req.body;

  try {
    const nuevoUsuario = await Usuario.create({ usuario, contraseña });

    //cuando se genera el JWT
    const token = jwt.sign({ usuarioId: nuevoUsuario.id }, SECRET_KEY, { expiresIn: "1h" });

    res.json({ message: "Usuario registrado", usuario: nuevoUsuario });
  } catch (error) {
    console.error("Error al registrar el usuario:", error);
    res.status(500).json({ error: "Error al registrar el usuario" });
  }
});

// escuchar el servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});