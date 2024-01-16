-- Crear la base de datos
CREATE DATABASE IF NOT EXISTS egresadosdb;
USE egresadosdb;

-- Crear la tabla rol
CREATE TABLE IF NOT EXISTS rol(
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    rol VARCHAR(7) NOT NULL UNIQUE);

-- Insertar roles
INSERT INTO rol (rol) VALUES ('admin'), ('user');

-- Crear la tabla users
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    user VARCHAR(255) NOT NULL UNIQUE,
    pass VARCHAR(255) NOT NULL,
    rol_id BIGINT NOT NULL DEFAULT 2,
    FOREIGN KEY (rol_id) REFERENCES rol(id)
);

INSERT INTO users (name, user, email, pass, rol_id) 
VALUES ('Administrador', 'admin', 'admin@gmail', '$2a$08$v74F1Kmuy6AkYuFHcRc39e1bPUXBqEh4vJsencWgTMOL5YN4fZXpu', 1);

-- Crear la tabla egresados
-- SIN NORMALIZACION PENSANDO EN MIGRAR A NOSQL A FUTURO
CREATE TABLE IF NOT EXISTS egresados (
    email VARCHAR(100) NOT NULL PRIMARY KEY,
    nombres VARCHAR(40) NOT NULL,
    apellidos VARCHAR(80) NOT NULL,
    calle_carrera VARCHAR(100) NOT NULL,
    numero_casa VARCHAR(100) NOT NULL,
    numero_torre VARCHAR(100) NULL,
    barrio_vereda VARCHAR(100) NOT NULL,
    codigo_postal INTEGER NOT NULL,
    detalles_direccion VARCHAR(255) NULL,
    ciudad_residencia VARCHAR(150) NOT NULL,
    departamento_residencia VARCHAR(150) NOT NULL,
    pais_residencia VARCHAR(150) NOT NULL,
    year_graduacion INT NOT NULL,
    imagen_url VARCHAR(255) NULL,
    coord_x DOUBLE NOT NULL,
    coord_y DOUBLE NOT NULL,
    numero_telefono VARCHAR(50) NOT NULL UNIQUE,
    portafolio_url VARCHAR(255) NULL,
    datos_publicos BOOLEAN NOT NULL DEFAULT 1,
    cargo_actual VARCHAR(100) NULL,
    empresa_url VARCHAR(255) NULL
);

-- Insertar datos de prueba en la tabla egresados
INSERT INTO egresados (email, nombres, apellidos, calle_carrera, numero_casa, numero_torre, barrio_vereda, codigo_postal, detalles_direccion, ciudad_residencia, departamento_residencia, pais_residencia, year_graduacion, imagen_url, coord_x, coord_y, numero_telefono, portafolio_url, datos_publicos, cargo_actual, empresa_url) VALUES
('juan.perez@example.com', 'Juan', 'Pérez', 'Calle Principal', '123', NULL, 'Centro', 12345, 'Cerca del parque', 'Bogotá', 'Cundinamarca', 'Colombia', 2020, 'http://res.cloudinary.com/dih4s70rh/image/upload/v1705101602/egresados/5894cvb286_mbicsk.jpg', 4.547597653099881, -75.66383667974051, "312542152212", 'https://portafolio1.com', 1, 'Desarrollador', 'https://empresa1.com'),
('maria.gonzales@mail.com', 'María', 'González', 'Avenida Central', '456', '2A', 'Alameda', 54321, 'Frente a la plaza', 'Lima', 'Lima', 'Perú', 2018, 'http://res.cloudinary.com/dih4s70rh/image/upload/v1705101603/egresados/asdfdsf6_clfdfn.jpg', 4.525280373195001, -75.7007663389334, "312542158212",'https://portafolio2.com', 1, 'Diseñadora', 'https://empresa2.com'),
('pedro.martinez@example.org', 'Pedro', 'Martínez', 'Carrera 5', '789', NULL, 'El Poblado', 67890, 'Cerca del río', 'Medellín', 'Antioquia', 'Colombia', 2019, 'http://res.cloudinary.com/dih4s70rh/image/upload/v1705101602/egresados/asd_h7cwyc.jpg', 4.542888063587283, -75.6853231650672, "312542152217", 'https://portafolio3.com', 1, 'Analista', 'https://empresa3.com'),
('laura.lopez@mail.com', 'Laura', 'López', 'Calle Mayor', '1011', '4B', 'La Floresta', 98765, 'Entre dos parques', 'Quito', 'Pichincha', 'Ecuador', 2021, 'http://res.cloudinary.com/dih4s70rh/image/upload/v1705101601/egresados/58942l%C3%B1kasdl%C3%B1k86_iztoad.jpg', 4.543449611475158, -75.66076976030351, "312542155612",'https://portafolio4.com', 1, 'Gerente', 'https://empresa4.com'),
('carlos.hernandez@example.com', 'Carlos', 'Hernández', 'Avenida Libertador', '1213', '8C', 'Villa Serena', 24680, 'Junto al centro comercial', 'Buenos Aires', 'Buenos Aires', 'Argentina', 2017, 'http://res.cloudinary.com/dih4s70rh/image/upload/v1705101601/egresados/5894tryrty286_nhhrk9.jpg', 4.520547149075574, -75.6476382181845, "312332152212", 'https://portafolio5.com', 1, 'Consultor', 'https://empresa5.com');
