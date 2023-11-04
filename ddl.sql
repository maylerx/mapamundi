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
    user VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    pass VARCHAR(255) NOT NULL,
    rol_id BIGINT NOT NULL DEFAULT 2,
    FOREIGN KEY (rol_id) REFERENCES rol(id)
);

INSERT INTO users (user, name, pass, rol_id) VALUES ('admin', 'Administrador', '$2a$08$v74F1Kmuy6AkYuFHcRc39e1bPUXBqEh4vJsencWgTMOL5YN4fZXpu', 1);

-- Crear la tabla egresados
CREATE TABLE IF NOT EXISTS egresados (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombres VARCHAR(40) NOT NULL,
    apellidos VARCHAR(80) NOT NULL,
    imagen_url VARCHAR(255) NULL,
    coord_x DOUBLE NOT NULL,
    coord_y DOUBLE NULL
);

-- Insertar datos de prueba en la tabla egresados
INSERT INTO egresados (nombres, apellidos, imagen_url, coord_x, coord_y)
VALUES
    ('Juan', 'Perez', 'https://res.cloudinary.com/dih4s70rh/image/upload/v1674939184/samples/people/smiling-man.jpg', 4.547597653099881, -75.66383667974051),
    ('Maria', 'Gomez', 'https://res.cloudinary.com/dih4s70rh/image/upload/v1674939184/samples/people/smiling-man.jpg', 4.525280373195001, -75.7007663389334),
    ('Pedro', 'Perez', 'https://res.cloudinary.com/dih4s70rh/image/upload/v1674939184/samples/people/smiling-man.jpg', 4.542888063587283, -75.6853231650672),
    ('Juanito', 'Fuentes', 'http://res.cloudinary.com/dih4s70rh/image/upload/v1695958118/egresados/du0c16cwrlkpwxqlsvpt.jpg', 4.543449611475158, -75.66076976030351),
    ('Copper', 'Murphy', 'http://res.cloudinary.com/dih4s70rh/image/upload/v1696001624/egresados/xgorhvdkdengbfyevmls.jpg', 4.619014666870284, -74.14267934206597),
    ('Juanito', 'Dongas', 'http://res.cloudinary.com/dih4s70rh/image/upload/v1696004091/egresados/rorhncsosbfzgraymtnq.png', 4.520547149075574, -75.6476382181845);
