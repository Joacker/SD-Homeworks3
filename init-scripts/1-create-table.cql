use medic_1;

CREATE TABLE medic_1.pacientes(
    id UUID, 
    nombre text,
    apellido text,
    rut text,
    email text,
    fecha_nacimiento text,
    PRIMARY KEY(id,rut)
);

use medic_2;

CREATE TABLE medic_2.recetas(
    id UUID PRIMARY KEY, 
    id_paciente UUID,
    comentario text,
    farmacos text,
    doctor text
);