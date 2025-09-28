-- Script para actualizar las restricciones de fecha de inicio de membresías
-- Este script permite fechas de inicio personalizadas y corrige el cálculo de fechas

-- Actualizar la función para manejar fechas de inicio personalizadas
CREATE OR REPLACE FUNCTION update_membership_on_payment_approval()
RETURNS TRIGGER AS $$
DECLARE
    membership_start_date DATE;
BEGIN
    -- Solo si el pago pasa de pending a approved
    IF OLD.status = 'pending' AND NEW.status = 'approved' THEN
        -- Obtener la fecha de inicio de la membresía
        SELECT start_date INTO membership_start_date 
        FROM memberships 
        WHERE id = NEW.membership_id;
        
        -- Si no hay fecha de inicio, usar la fecha actual
        IF membership_start_date IS NULL THEN
            membership_start_date := CURRENT_DATE;
        END IF;
        
        UPDATE memberships 
        SET 
            status = 'active',
            start_date = membership_start_date,
            end_date = membership_start_date + INTERVAL '1 month'
        WHERE id = NEW.membership_id;
        
        -- Registrar fecha de aprobación
        NEW.approved_date = NOW();
    END IF;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Comentario explicativo
COMMENT ON FUNCTION update_membership_on_payment_approval() IS 
'Actualizada para preservar fechas de inicio personalizadas y calcular end_date correctamente desde start_date';

-- Verificar que el trigger existe y está funcionando
SELECT 
    trigger_name, 
    event_manipulation, 
    action_timing, 
    action_statement
FROM information_schema.triggers 
WHERE trigger_name = 'update_membership_on_payment_approval_trigger';