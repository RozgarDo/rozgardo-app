SELECT 
    conname, 
    pg_get_constraintdef(oid) 
FROM 
    pg_constraint 
WHERE 
    conrelid = 'public.applications'::regclass 
    AND contype = 'c';
