INSERT INTO roles (nombre_rol) VALUES
    ('admin'),
    ('user')
ON CONFLICT DO NOTHING;

INSERT INTO categorias (nombre, icono, color, es_default, usuario_id) VALUES
    ('Comida',           '🍔', '#EF4444', TRUE, NULL),
    ('Transporte',       '🚗', '#3B82F6', TRUE, NULL),
    ('Entretenimiento',  '🎮', '#8B5CF6', TRUE, NULL),
    ('Salud',            '🩺', '#10B981', TRUE, NULL),
    ('Ropa',             '👟', '#F97316', TRUE, NULL),
    ('Servicios',        '💡', '#EAB308', TRUE, NULL),
    ('Educacion',        '📚', '#6366F1', TRUE, NULL),
    ('Ahorro',           '💰', '#22C55E', TRUE, NULL)
ON CONFLICT DO NOTHING;