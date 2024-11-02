CREATE DATABASE db_tienda;
USE db_tienda;
CREATE USER 'administrador'@'localhost' IDENTIFIED BY 'contraseña';
GRANT ALL PRIVILEGES ON db_tienda.* TO 'administrador'@'localhost';

CREATE TABLE productos (
    id_producto INT NOT NULL,
    nombre VARCHAR(255),
    precio INT,
    PRIMARY KEY (id_producto)
);

CREATE TABLE usuarios(
	usuario VARCHAR(50),
	contraseña VARCHAR(50)
);

CREATE TABLE carrito(
	producto_id INT, 
    cantidad INT DEFAULT 1,
	FOREIGN KEY (producto_id) REFERENCES productos(id_producto)
);

SELECT * FROM productos;
SELECT * FROM usuarios;
SELECT * FROM carrito;

INSERT INTO productos (id_producto, nombre, precio) VALUES (1,refrigerador,780000);
INSERT INTO productos (id_producto, nombre, precio) VALUES (2,lavadora,578000); 
INSERT INTO productos (id_producto, nombre, precio) VALUES (3,licuadora,250000); 
INSERT INTO productos (id_producto, nombre, precio) VALUES (4,microndas,250000); 
INSERT INTO productos (id_producto, nombre, precio) VALUES (5,impresora,250000); 
INSERT INTO productos (id_producto, nombre, precio) VALUES (6,robot,250000);
