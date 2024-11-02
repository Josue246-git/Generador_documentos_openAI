CREATE DATABASE db_generador_docs_openAI;

DROP TABLE db_generador_docs_openAI	


CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    cedula CHAR (10) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    rol VARCHAR(50) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
	CHECK (CHAR_LENGTH(cedula) = 10 AND cedula ~ '^[0-9]+$')
);









