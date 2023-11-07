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

INSERT INTO users (user, name, pass, rol_id) 
VALUES ('admin', 'Administrador', '$2a$08$v74F1Kmuy6AkYuFHcRc39e1bPUXBqEh4vJsencWgTMOL5YN4fZXpu', 1);

CREATE TABLE IF NOT EXISTS carrera_cursada (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE
);

-- Crear la tabla egresados
CREATE TABLE IF NOT EXISTS egresados (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombres VARCHAR(40) NOT NULL,
    apellidos VARCHAR(80) NOT NULL,
    direccion VARCHAR(100) NOT NULL,
    ciudad VARCHAR(150) NOT NULL,
    departamento VARCHAR(150) NOT NULL,
    pais VARCHAR(150) NOT NULL,
    email VARCHAR(100) NOT NULL,
    year_graduacion INT NOT NULL,
    imagen_url VARCHAR(255) NULL,
    coord_x DOUBLE NOT NULL,
    coord_y DOUBLE NULL,
    portafolio_url VARCHAR(255) NULL,
    datos_publicos BOOLEAN NOT NULL DEFAULT true,
    carrera_cursada_id BIGINT NOT NULL,
    FOREIGN KEY (carrera_cursada_id) REFERENCES carrera_cursada(id)
);

-- Insertar datos de las carreras de la uq
INSERT INTO carrera_cursada (nombre) VALUES
    ("Administración de Negocios a Distancia"),
    ("Administración de Negocios Presencial"),
    ("Administración Financiera a Distancia"),
    ("Artes Visuales"),
    ("Biología"),
    ("Ciencia de la Información y la Documentación, Bibliotecología y Archivística"),
    ("Comunicación Social - Periodismo"),
    ("Concurso Atención de Triage para Profesionales de la Salud"),
    ("Contaduría Pública"),
    ("Curso Especializado en Artes Plásticas"),
    ("Curso Especializado en Inglés para niños"),
    ("Curso Especializado en Música"),
    ("Curso Especializado en Teatro"),
    ("Curso Preuniversitario"),
    ("Diplomado en Docencia Universitaria"),
    ("Diplomado en Plantas Medicinales"),
    ("Diplomado en Prevención, Preparación y Respuesta a Emergencias Empresariales - PPREE"),
    ("Diplomado Gestión del Desarrollo Territorial"),
    ("Diplomado Vivencial en Pedagogía Emocional Comunitaria"),
    ("Doctorado en Ciencias"),
    ("Doctorado en Ciencias de la Educación"),
    ("Economía"),
    ("Enfermería"),
    ("Especialización en Administración Hospitalaria en Convenio con la Ean"),
    ("Especialización en Contabilidad Financiera Internacional"),
    ("Especialización en Gerencia Estratégica de la Auditoría Interna"),
    ("Especialización en Gerencia Tributaria Internacional"),
    ("Especialización en Pediatría"),
    ("Filosofía"),
    ("Física"),
    ("Gerontología"),
    ("Ingeniería Civil"),
    ("Ingeniería de Alimentos"),
    ("Ingeniería de Sistemas y Computación"),
    ("Ingeniería Electrónica"),
    ("Ingeniería Topográfica y Geomática"),
    ("Licenciatura en Ciencias Naturales y Educación Ambiental"),
    ("Licenciatura en Ciencias Sociales"),
    ("Licenciatura en Educación Física, Recreación y Deportes"),
    ("Licenciatura en Educación Infantil"),
    ("Licenciatura en Lenguas Modernas con énfasis en Inglés y Francés"),
    ("Licenciatura en Literatura y Lengua Castellana"),
    ("Licenciatura en Matemáticas"),
    ("Maestría en Administración"),
    ("Maestría en Agronegocios del Café"),
    ("Maestría en Auditoría y Control de Gestión"),
    ("Maestría en Biomatemáticas"),
    ("Maestría en Ciencias Biomédicas"),
    ("Maestría en Ciencias de la Educación"),
    ("Maestría en Gestión de Riesgo de Desastres"),
    ("Maestría en Ingeniería"),
    ("Maestría en Procesos Agroindustriales"),
    ("Medicina"),
    ("Química"),
    ("Seguridad y Salud en el Trabajo"),
    ("Tecnología en Instrumentación Electrónica"),
    ("Tecnología En Obras Civiles"),
    ("Trabajo Social"),
    ("Zootecnia");

-- Insertar datos de prueba en la tabla egresados
INSERT INTO egresados (nombres, apellidos, direccion, ciudad, departamento, pais, email, year_graduacion, imagen_url, coord_x, coord_y, portafolio_url, datos_publicos, carrera_cursada_id)
VALUES
    ('Juan', 'Perez', 'Calle 123', 'Armenia', 'Quindio', 'Colombia', 'juan.perez@example.com', 2022, 'https://res.cloudinary.com/dih4s70rh/image/upload/v1674939184/samples/people/smiling-man.jpg', 4.547597653099881, -75.66383667974051, 'https://www.portafoliojuan.com', true, 1),
    ('Maria', 'Gomez', 'Avenida 789', 'Pereira', 'Quindio', 'Colombia', 'maria.gomez@example.com', 2023, 'https://res.cloudinary.com/dih4s70rh/image/upload/v1674939184/samples/people/smiling-man.jpg', 4.525280373195001, -75.7007663389334, 'https://www.portafoliomaria.com', true, 2),
    ('Pedro', 'Perez', 'Carrera 234', 'Medellin', 'Antioquia', 'Colombia', 'pedro.perez@example.com', 2021, 'https://res.cloudinary.com/dih4s70rh/image/upload/v1674939184/samples/people/smiling-man.jpg', 4.542888063587283, -75.6853231650672, 'https://www.portafoliopedro.com', true, 3),
    ('Juanito', 'Fuentes', 'Calle 8910', 'Armenia', 'Quindio', 'Colombia', 'juanito.fuentes@example.com', 2022, 'http://res.cloudinary.com/dih4s70rh/image/upload/v1695958118/egresados/du0c16cwrlkpwxqlsvpt.jpg', 4.543449611475158, -75.66076976030351, 'https://www.portafoliojuanito.com', false, 4),
    ('Copper', 'Murphy', 'Avenida 1314', 'Medellin', 'Antioquia', 'Colombia', 'copper.murphy@example.com', 2023, 'http://res.cloudinary.com/dih4s70rh/image/upload/v1696001624/egresados/xgorhvdkdengbfyevmls.jpg', 4.619014666870284, -74.14267934206597, 'https://www.portafoliocopper.com', false, 5),
    ('Juanito', 'Dongas', 'Carrera 1718', 'Medellin', 'Antioquia', 'Colombia', 'juanito.dongas@example.com', 2021, 'http://res.cloudinary.com/dih4s70rh/image/upload/v1696004091/egresados/rorhncsosbfzgraymtnq.png', 4.520547149075574, -75.6476382181845, 'https://www.portafoliojuanito.com', true, 6);
