const express = require('express');
const router = express.Router();
const supabase = require('../supabaseClient');

// Helper: enrich jobs with employer name from users table
async function enrichJobsWithEmployerName(jobs) {
    // Get unique employer IDs
    const employerIds = [...new Set(jobs.map(j => j.employer_id).filter(Boolean))];
    if (employerIds.length === 0) return jobs.map(j => ({ ...j, employer_name: 'Unknown' }));

    const { data: employers } = await supabase
        .from('users')
        .select('id, name')
        .in('id', employerIds);

    const employerMap = {};
    (employers || []).forEach(e => { employerMap[e.id] = e.name; });

    return jobs.map(job => ({
        ...job,
        employer_name: employerMap[job.employer_id] || 'Unknown Employer'
    }));
}

// Get jobs (supports query params: status, employer_id)
router.get('/', async (req, res) => {
    const { status, employer_id } = req.query;
    let query = supabase.from('jobs').select('*').order('created_at', { ascending: false });
    
    if (status) query = query.eq('status', status);
    if (employer_id) query = query.eq('employer_id', employer_id);
    
    try {
        const { data, error } = await query;
        if (error) return res.status(400).json({ error: error.message });
        const enriched = await enrichJobsWithEmployerName(data);
        res.json(enriched);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get single job details (with employer name)
router.get('/:id', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('jobs')
            .select('*')
            .eq('id', req.params.id)
            .single();
        if (error) return res.status(400).json({ error: error.message });
        
        // Get employer name
        if (data.employer_id) {
            const { data: employer } = await supabase
                .from('users')
                .select('name')
                .eq('id', data.employer_id)
                .single();
            data.employer_name = employer?.name || 'Unknown Employer';
        }
        
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Post a new job (Defaults to pending status)
router.post('/', async (req, res) => {
    const { title, category, salary, location, description, employer_id } = req.body;
    try {
        const { data, error } = await supabase
            .from('jobs')
            .insert([{ title, category, salary, location, description: description || 'No description provided.', employer_id, status: 'pending' }])
            .select()
            .single();

        if (error) return res.status(400).json({ error: error.message });
        res.status(201).json({ message: 'Job posted successfully', job: data });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update job status (Admin functionality)
router.patch('/:id/status', async (req, res) => {
    const { status } = req.body; // expected: 'approved' or 'rejected'
    try {
        const { data, error } = await supabase
            .from('jobs')
            .update({ status })
            .eq('id', req.params.id)
            .select()
            .single();
            
        if (error) return res.status(400).json({ error: error.message });
        res.json({ message: `Job ${status}`, job: data });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
