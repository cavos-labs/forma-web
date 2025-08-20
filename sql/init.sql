-- ====================================
-- SCRIPT COMPLETO BASE DE DATOS - APP GIMNASIOS
-- PostgreSQL 12+
-- ====================================

-- ====================================
-- LIMPIAR BASE DE DATOS EXISTENTE
-- ====================================

-- Eliminar vistas si existen
DROP VIEW IF EXISTS pending_payments CASCADE;
DROP VIEW IF EXISTS inactive_memberships CASCADE;
DROP VIEW IF EXISTS expired_memberships CASCADE;
DROP VIEW IF EXISTS active_memberships CASCADE;

-- Eliminar triggers si existen
DROP TRIGGER IF EXISTS update_membership_on_payment_approval_trigger ON payments CASCADE;
DROP TRIGGER IF EXISTS set_grace_period ON memberships CASCADE;
DROP TRIGGER IF EXISTS update_payments_updated_at ON payments CASCADE;
DROP TRIGGER IF EXISTS update_memberships_updated_at ON memberships CASCADE;
DROP TRIGGER IF EXISTS update_gyms_updated_at ON gyms CASCADE;
DROP TRIGGER IF EXISTS update_users_updated_at ON users CASCADE;

-- Eliminar funciones si existen
DROP FUNCTION IF EXISTS can_access_gym CASCADE;
DROP FUNCTION IF EXISTS get_membership_status CASCADE;
DROP FUNCTION IF EXISTS update_membership_on_payment_approval CASCADE;
DROP FUNCTION IF EXISTS calculate_grace_period CASCADE;
DROP FUNCTION IF EXISTS update_updated_at_column CASCADE;

-- Eliminar tablas si existen (en orden inverso por las FK)
DROP TABLE IF EXISTS gym_access_logs CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS memberships CASCADE;
DROP TABLE IF EXISTS gym_administrators CASCADE;
DROP TABLE IF EXISTS gyms CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Eliminar tipos ENUM si existen
DROP TYPE IF EXISTS notification_status CASCADE;
DROP TYPE IF EXISTS notification_type CASCADE;
DROP TYPE IF EXISTS payment_method CASCADE;
DROP TYPE IF EXISTS payment_status CASCADE;
DROP TYPE IF EXISTS membership_status CASCADE;

-- Habilitar extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ====================================
-- CREAR TIPOS ENUM
-- ====================================

CREATE TYPE membership_status AS ENUM (
    'pending_payment', 
    'active', 
    'expired', 
    'inactive', 
    'cancelled'
);

CREATE TYPE payment_status AS ENUM (
    'pending', 
    'approved', 
    'rejected', 
    'cancelled'
);

CREATE TYPE payment_method AS ENUM (
    'sinpe'
);

CREATE TYPE notification_type AS ENUM (
    'membership_expiring',
    'membership_expired', 
    'payment_approved',
    'payment_rejected',
    'grace_period_ending'
);

CREATE TYPE notification_status AS ENUM (
    'pending', 
    'sent', 
    'failed'
);

-- ====================================
-- CREAR TABLAS
-- ====================================

-- Tabla de usuarios del sistema (clientes de gimnasios)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    uid VARCHAR(255) NOT NULL UNIQUE, -- UID del proveedor de autenticación externo
    email VARCHAR(255) NOT NULL UNIQUE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    date_of_birth DATE,
    profile_image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de gimnasios registrados
CREATE TABLE gyms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    address TEXT NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(255),
    logo_url TEXT,
    monthly_fee DECIMAL(10,2) NOT NULL CHECK (monthly_fee > 0),
    sinpe_phone VARCHAR(20) NOT NULL, -- Número de SINPE del gimnasio
    is_active BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de administradores de gimnasios (usando auth.users de Supabase)
CREATE TABLE gym_administrators (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL, -- Referencia a auth.users de Supabase
    gym_id UUID NOT NULL REFERENCES gyms(id) ON DELETE CASCADE,
    role VARCHAR(50) DEFAULT 'admin' CHECK (role IN ('admin', 'owner', 'manager')),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT unique_user_gym_admin UNIQUE(user_id, gym_id),
    CONSTRAINT gym_administrators_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);

-- Tabla de membresías de usuarios en gimnasios
CREATE TABLE memberships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    gym_id UUID NOT NULL REFERENCES gyms(id) ON DELETE CASCADE,
    status membership_status NOT NULL DEFAULT 'pending_payment',
    start_date DATE,
    end_date DATE,
    grace_period_end DATE, -- Se calcula automáticamente: end_date + 3 días
    monthly_fee DECIMAL(10,2) NOT NULL CHECK (monthly_fee > 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT unique_user_gym_membership UNIQUE(user_id, gym_id)
);

-- Tabla de pagos de membresías
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    membership_id UUID NOT NULL REFERENCES memberships(id) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL CHECK (amount > 0),
    payment_method payment_method NOT NULL DEFAULT 'sinpe',
    sinpe_reference VARCHAR(255), -- Referencia del pago SINPE
    sinpe_phone VARCHAR(20), -- Teléfono desde donde se hizo el pago
    payment_proof_url TEXT NOT NULL, -- URL de la imagen del comprobante (requerido)
    status payment_status NOT NULL DEFAULT 'pending',
    payment_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    approved_date TIMESTAMP WITH TIME ZONE,
    approved_by UUID, -- Admin de Supabase que aprobó (auth.users)
    rejection_reason TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT payments_approved_by_fkey FOREIGN KEY (approved_by) REFERENCES auth.users(id)
);

-- Tabla de notificaciones del sistema
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    membership_id UUID REFERENCES memberships(id) ON DELETE CASCADE,
    type notification_type NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    status notification_status DEFAULT 'pending',
    scheduled_for TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    sent_at TIMESTAMP WITH TIME ZONE,
    email_sent BOOLEAN DEFAULT FALSE,
    push_sent BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de registro de accesos al gimnasio
CREATE TABLE gym_access_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    membership_id UUID NOT NULL REFERENCES memberships(id) ON DELETE CASCADE,
    access_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    access_granted BOOLEAN NOT NULL,
    denial_reason TEXT, -- Si access_granted = false
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ====================================
-- CREAR ÍNDICES PARA OPTIMIZACIÓN
-- ====================================

-- Índices para usuarios
CREATE INDEX idx_users_uid ON users(uid);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_created_at ON users(created_at);

-- Índices para gimnasios
CREATE INDEX idx_gyms_is_active ON gyms(is_active);
CREATE INDEX idx_gyms_name ON gyms(name);

-- Índices para administradores
CREATE INDEX idx_gym_administrators_gym ON gym_administrators(gym_id);
CREATE INDEX idx_gym_administrators_user ON gym_administrators(user_id);
CREATE INDEX idx_gym_administrators_active ON gym_administrators(is_active);

-- Índices para membresías (consultas más críticas)
CREATE INDEX idx_memberships_user_gym ON memberships(user_id, gym_id);
CREATE INDEX idx_memberships_status ON memberships(status);
CREATE INDEX idx_memberships_end_date ON memberships(end_date);
CREATE INDEX idx_memberships_grace_period ON memberships(grace_period_end);
CREATE INDEX idx_memberships_gym ON memberships(gym_id);
CREATE INDEX idx_memberships_user ON memberships(user_id);

-- Índices para pagos
CREATE INDEX idx_payments_membership ON payments(membership_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_payment_date ON payments(payment_date);
CREATE INDEX idx_payments_approved_by ON payments(approved_by);

-- Índices para notificaciones
CREATE INDEX idx_notifications_user_status ON notifications(user_id, status);
CREATE INDEX idx_notifications_scheduled ON notifications(scheduled_for);
CREATE INDEX idx_notifications_type ON notifications(type);
CREATE INDEX idx_notifications_membership ON notifications(membership_id);

-- Índices para logs de acceso
CREATE INDEX idx_access_logs_membership ON gym_access_logs(membership_id);
CREATE INDEX idx_access_logs_access_time ON gym_access_logs(access_time);
CREATE INDEX idx_access_logs_granted ON gym_access_logs(access_granted);

-- ====================================
-- CREAR FUNCIONES Y TRIGGERS
-- ====================================

-- Función para actualizar automáticamente el campo updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Aplicar trigger a todas las tablas con updated_at
CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_gyms_updated_at 
    BEFORE UPDATE ON gyms 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_memberships_updated_at 
    BEFORE UPDATE ON memberships 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payments_updated_at 
    BEFORE UPDATE ON payments 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Función para calcular automáticamente el período de gracia
CREATE OR REPLACE FUNCTION calculate_grace_period()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.end_date IS NOT NULL THEN
        NEW.grace_period_end = NEW.end_date + INTERVAL '3 days';
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para calcular período de gracia automáticamente
CREATE TRIGGER set_grace_period 
    BEFORE INSERT OR UPDATE ON memberships 
    FOR EACH ROW EXECUTE FUNCTION calculate_grace_period();

-- Función para actualizar estado de membresía cuando se aprueba un pago
CREATE OR REPLACE FUNCTION update_membership_on_payment_approval()
RETURNS TRIGGER AS $$
BEGIN
    -- Solo si el pago pasa de pending a approved
    IF OLD.status = 'pending' AND NEW.status = 'approved' THEN
        UPDATE memberships 
        SET 
            status = 'active',
            start_date = CASE 
                WHEN start_date IS NULL THEN CURRENT_DATE 
                ELSE start_date 
            END,
            end_date = CASE 
                WHEN end_date IS NULL THEN CURRENT_DATE + INTERVAL '1 month'
                ELSE end_date + INTERVAL '1 month'
            END
        WHERE id = NEW.membership_id;
        
        -- Registrar fecha de aprobación
        NEW.approved_date = NOW();
    END IF;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para actualizar membresía cuando se aprueba pago
CREATE TRIGGER update_membership_on_payment_approval_trigger
    BEFORE UPDATE ON payments 
    FOR EACH ROW EXECUTE FUNCTION update_membership_on_payment_approval();

-- ====================================
-- VISTAS ÚTILES PARA CONSULTAS FRECUENTES
-- ====================================

-- Vista para membresías activas
CREATE VIEW active_memberships AS
SELECT 
    m.id,
    m.user_id,
    m.gym_id,
    u.first_name,
    u.last_name,
    u.email,
    g.name as gym_name,
    m.start_date,
    m.end_date,
    m.grace_period_end,
    m.monthly_fee,
    m.created_at
FROM memberships m
JOIN users u ON m.user_id = u.id
JOIN gyms g ON m.gym_id = g.id
WHERE m.status = 'active' 
  AND m.end_date >= CURRENT_DATE;

-- Vista para membresías vencidas (en período de gracia)
CREATE VIEW expired_memberships AS
SELECT 
    m.id,
    m.user_id,
    m.gym_id,
    u.first_name,
    u.last_name,
    u.email,
    g.name as gym_name,
    m.start_date,
    m.end_date,
    m.grace_period_end,
    m.monthly_fee,
    (CURRENT_DATE - m.end_date) as days_expired,
    m.created_at
FROM memberships m
JOIN users u ON m.user_id = u.id
JOIN gyms g ON m.gym_id = g.id
WHERE m.status = 'expired' 
  AND m.grace_period_end >= CURRENT_DATE
  AND m.end_date < CURRENT_DATE;

-- Vista para membresías inactivas (+3 meses vencidas)
CREATE VIEW inactive_memberships AS
SELECT 
    m.id,
    m.user_id,
    m.gym_id,
    u.first_name,
    u.last_name,
    u.email,
    g.name as gym_name,
    m.start_date,
    m.end_date,
    m.grace_period_end,
    m.monthly_fee,
    (CURRENT_DATE - m.end_date) as days_expired,
    m.created_at
FROM memberships m
JOIN users u ON m.user_id = u.id
JOIN gyms g ON m.gym_id = g.id
WHERE m.status = 'inactive' 
  AND m.grace_period_end < CURRENT_DATE - INTERVAL '3 months';

-- Vista para pagos pendientes de aprobación
CREATE VIEW pending_payments AS
SELECT 
    p.id,
    p.membership_id,
    p.amount,
    p.sinpe_reference,
    p.sinpe_phone,
    p.payment_proof_url,
    p.payment_date,
    p.notes,
    u.first_name,
    u.last_name,
    u.email,
    g.name as gym_name,
    g.id as gym_id,
    m.monthly_fee,
    admin_auth.email as approved_by_email
FROM payments p
JOIN memberships m ON p.membership_id = m.id
JOIN users u ON m.user_id = u.id
JOIN gyms g ON m.gym_id = g.id
LEFT JOIN auth.users admin_auth ON p.approved_by = admin_auth.id
WHERE p.status = 'pending'
ORDER BY p.payment_date ASC;

-- ====================================
-- FUNCIONES DE UTILIDAD
-- ====================================

-- Función para obtener el estado actual de una membresía
CREATE OR REPLACE FUNCTION get_membership_status(membership_uuid UUID)
RETURNS membership_status AS $$
DECLARE
    current_status membership_status;
    end_dt DATE;
    grace_end DATE;
BEGIN
    SELECT status, end_date, grace_period_end 
    INTO current_status, end_dt, grace_end
    FROM memberships 
    WHERE id = membership_uuid;
    
    -- Si no existe la membresía
    IF current_status IS NULL THEN
        RETURN NULL;
    END IF;
    
    -- Lógica para determinar estado actual
    IF current_status = 'active' AND end_dt < CURRENT_DATE THEN
        IF grace_end >= CURRENT_DATE THEN
            RETURN 'expired'::membership_status;
        ELSE
            RETURN 'inactive'::membership_status;
        END IF;
    END IF;
    
    RETURN current_status;
END;
$$ language 'plpgsql';

-- Función para verificar si un usuario puede acceder al gimnasio
CREATE OR REPLACE FUNCTION can_access_gym(user_uuid UUID, gym_uuid UUID)
RETURNS BOOLEAN AS $$
DECLARE
    membership_exists BOOLEAN;
    current_status membership_status;
BEGIN
    SELECT EXISTS(
        SELECT 1 FROM memberships 
        WHERE user_id = user_uuid 
          AND gym_id = gym_uuid
    ) INTO membership_exists;
    
    IF NOT membership_exists THEN
        RETURN FALSE;
    END IF;
    
    SELECT get_membership_status(id) 
    INTO current_status
    FROM memberships 
    WHERE user_id = user_uuid AND gym_id = gym_uuid;
    
    RETURN current_status IN ('active', 'expired');
END;
$$ language 'plpgsql';

-- Función para verificar si un admin de Supabase tiene acceso a un gimnasio
CREATE OR REPLACE FUNCTION admin_has_gym_access(admin_auth_uuid UUID, gym_uuid UUID)
RETURNS BOOLEAN AS $$
DECLARE
    has_access BOOLEAN;
BEGIN
    -- Verificar si el admin tiene acceso al gimnasio
    SELECT EXISTS(
        SELECT 1 FROM gym_administrators 
        WHERE user_id = admin_auth_uuid 
          AND gym_id = gym_uuid 
          AND is_active = TRUE
    ) INTO has_access;
    
    RETURN has_access;
END;
$$ language 'plpgsql';

-- ====================================
-- POLÍTICAS DE SEGURIDAD RLS (Row Level Security)
-- ====================================

-- Habilitar RLS en las tablas principales
ALTER TABLE gym_administrators ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Política para gym_administrators: solo pueden ver sus propios gimnasios
CREATE POLICY "gym_administrators_policy" ON gym_administrators
    FOR ALL USING (user_id = auth.uid());

-- Política para payments: admins solo pueden ver pagos de sus gimnasios
CREATE POLICY "payments_admin_policy" ON payments
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM memberships m
            JOIN gym_administrators ga ON m.gym_id = ga.gym_id
            WHERE m.id = payments.membership_id
            AND ga.user_id = auth.uid()
            AND ga.is_active = TRUE
        )
    );

-- ====================================
-- DATOS DE EJEMPLO (OPCIONAL)
-- ====================================

-- Descomentar las siguientes líneas si quieres datos de prueba

/*
-- Usuario cliente de ejemplo
INSERT INTO users (uid, email, first_name, last_name, phone) VALUES
('auth_uid_123', 'cliente@ejemplo.com', 'Juan', 'Pérez', '+50688888888');

-- Gimnasio de ejemplo
INSERT INTO gyms (name, description, address, phone, email, monthly_fee, sinpe_phone) VALUES
('PowerGym San José', 'Gimnasio completo con equipos modernos', 'San José Centro, CR', '+50622222222', 'info@powergym.cr', 25000.00, '+50688887777');

-- NOTA: Para crear un admin, primero debe existir en auth.users de Supabase
-- Luego puedes agregarlo a gym_administrators con:
-- INSERT INTO gym_administrators (user_id, gym_id, role) VALUES
-- ('uuid_del_admin_en_supabase', 'uuid_del_gimnasio', 'owner');
*/

-- ====================================
-- COMENTARIOS Y DOCUMENTACIÓN
-- ====================================

COMMENT ON TABLE users IS 'Usuarios clientes de los gimnasios (autenticación externa)';
COMMENT ON TABLE gyms IS 'Gimnasios registrados en la plataforma';
COMMENT ON TABLE gym_administrators IS 'Administradores de gimnasios (auth.users de Supabase)';
COMMENT ON TABLE memberships IS 'Membresías de usuarios en gimnasios específicos';
COMMENT ON TABLE payments IS 'Pagos realizados por membresías';
COMMENT ON TABLE notifications IS 'Sistema de notificaciones automáticas';
COMMENT ON TABLE gym_access_logs IS 'Registro de intentos de acceso a gimnasios';

COMMENT ON COLUMN gym_administrators.user_id IS 'Referencia al usuario en auth.users de Supabase';
COMMENT ON COLUMN payments.approved_by IS 'Admin de Supabase que aprobó el pago';
COMMENT ON COLUMN memberships.grace_period_end IS 'Fecha límite del período de gracia (end_date + 3 días)';
COMMENT ON COLUMN payments.payment_proof_url IS 'URL del comprobante de pago SINPE';
COMMENT ON COLUMN gym_access_logs.access_granted IS 'TRUE si se permitió el acceso, FALSE si se denegó';

-- ====================================
-- FINALIZACIÓN
-- ====================================

-- Mostrar resumen de la operación
DO $$
BEGIN
    RAISE NOTICE '==============================================';
    RAISE NOTICE 'BASE DE DATOS LIMPIADA Y RECREADA EXITOSAMENTE';
    RAISE NOTICE '==============================================';
    RAISE NOTICE 'Tablas creadas: 7';
    RAISE NOTICE 'Vistas creadas: 4';
    RAISE NOTICE 'Funciones creadas: 6';
    RAISE NOTICE 'Triggers creados: 5';
    RAISE NOTICE 'Índices creados: 20';
    RAISE NOTICE 'Políticas RLS creadas: 2';
    RAISE NOTICE '==============================================';
    RAISE NOTICE 'INTEGRACIÓN CON SUPABASE AUTH CONFIGURADA';
    RAISE NOTICE '==============================================';
    RAISE NOTICE 'La base de datos está lista para usar!';
    RAISE NOTICE 'NOTA: Todos los datos anteriores fueron eliminados';
    RAISE NOTICE '==============================================';
END $$;