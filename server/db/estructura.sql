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

insert into users (cedula, password, rol) values ('1234567890', '123456', 'admin');
insert into users (cedula, password, rol) values ('0987654321', '123456', 'user');
insert into users (cedula, password, rol) values ('1234567891', '123456', 'user');

select * from users



CREATE TABLE estr_documentos (
  id SERIAL PRIMARY KEY,
  titulo TEXT NOT NULL,
  prompt_user TEXT NOT NULL,
  contexto_base TEXT NOT NULL,
  puntos TEXT[] NOT NULL,
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


select	* from estr_documentos
