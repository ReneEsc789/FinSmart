CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS roles (
    id         SERIAL PRIMARY KEY,
    nombre_rol VARCHAR(20) NOT NULL
);

CREATE TABLE IF NOT EXISTS usuarios (
    id              UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre          VARCHAR(150) NOT NULL,
    email           VARCHAR(100) NOT NULL,
    contrasena_hash VARCHAR(250) NOT NULL,
    moneda          VARCHAR(10)  DEFAULT 'MXN',
    rol_id          INT          NOT NULL DEFAULT 2 REFERENCES roles(id),
    fecha_creacion  TIMESTAMP    DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS categorias (
    id         UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre     VARCHAR(50)  NOT NULL,
    icono      VARCHAR(50),
    color      VARCHAR(30),
    es_default BOOLEAN      DEFAULT FALSE,
    usuario_id UUID         REFERENCES usuarios(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS cuentas (
    id             UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
    usuario_id     UUID         NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    nombre         VARCHAR(50)  NOT NULL,
    tipo           VARCHAR(50)  NOT NULL,
    saldo_inicial  FLOAT        DEFAULT 0,
    saldo_actual   FLOAT        DEFAULT 0,
    fecha_creacion TIMESTAMP    DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS presupuestos (
    id           UUID  PRIMARY KEY DEFAULT uuid_generate_v4(),
    usuario_id   UUID  NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    categoria_id UUID  NOT NULL REFERENCES categorias(id) ON DELETE CASCADE,
    monto_limite FLOAT NOT NULL,
    periodo      VARCHAR(20) NOT NULL,
    fecha_inicio DATE        NOT NULL,
    fecha_fin    DATE        NOT NULL
);

CREATE TABLE IF NOT EXISTS transacciones (
    id             UUID  PRIMARY KEY DEFAULT uuid_generate_v4(),
    usuario_id     UUID  NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    cuenta_id      UUID  NOT NULL REFERENCES cuentas(id) ON DELETE CASCADE,
    categoria_id   UUID  NOT NULL REFERENCES categorias(id) ON DELETE CASCADE,
    monto          FLOAT NOT NULL,
    tipo           VARCHAR(50) NOT NULL,
    nota           VARCHAR(100),
    fecha          DATE        NOT NULL,
    fecha_creacion TIMESTAMP   DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS alertas_ml (
    id              UUID  PRIMARY KEY DEFAULT uuid_generate_v4(),
    usuario_id      UUID  NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    tipo_alerta     VARCHAR(50)  NOT NULL,
    mensaje         TEXT         NOT NULL,
    valor_detectado FLOAT,
    leida           BOOLEAN      DEFAULT FALSE,
    generada_en     TIMESTAMP    DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS uq_roles_nombre
    ON roles (LOWER(nombre_rol));

CREATE UNIQUE INDEX IF NOT EXISTS uq_usuarios_email
    ON usuarios (LOWER(email));

CREATE UNIQUE INDEX IF NOT EXISTS uq_categorias_default_nombre
    ON categorias (LOWER(nombre))
    WHERE usuario_id IS NULL;

CREATE UNIQUE INDEX IF NOT EXISTS uq_categorias_usuario_nombre
    ON categorias (usuario_id, LOWER(nombre))
    WHERE usuario_id IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS uq_cuentas_usuario_nombre
    ON cuentas (usuario_id, LOWER(nombre));

CREATE UNIQUE INDEX IF NOT EXISTS uq_presupuestos_usuario_categoria_periodo
    ON presupuestos (usuario_id, categoria_id, periodo);