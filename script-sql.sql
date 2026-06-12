CREATE TABLE usuarios (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    firebase_uid VARCHAR(128) UNIQUE NOT NULL AFTER id,
    username    VARCHAR(50)  NOT NULL UNIQUE,
    email       VARCHAR(100) NOT NULL UNIQUE,
    password    VARCHAR(255) NOT NULL,                          
    rol         ENUM('jugador', 'soporte', 'superadmin') NOT NULL DEFAULT 'jugador',
    creado_en   DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE carpetas (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id  INT          NOT NULL,
    nombre      VARCHAR(100) NOT NULL,
    creado_en   DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

CREATE TABLE lista_juegos (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id      INT NOT NULL,
    rawg_juego_id   INT NOT NULL,
    carpeta_id      INT,
    añadido_en      DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id)  REFERENCES usuarios(id)    ON DELETE CASCADE,
    FOREIGN KEY (carpeta_id)  REFERENCES carpetas(id)    ON DELETE SET NULL
);