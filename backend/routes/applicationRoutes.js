const express = require('express');
const router = express.Router();
const supabase = require('../supabaseClient');

// Apply for a job
router.post('/', async (req, res) => {
    const { job_id, employee_id } = req.body;
    try {
        // Check if already applied
        const { data: existing } = await supabase
            .from('applications')
            .select('id')
            .eq('job_id', job_id)
            .eq('employee_id', employee_id)
            .maybeSingle();

        if (existing) {
            return res.status(400).json({ error: 'You have already applied for this job.' });
        }

        const { data, error } = await supabase
            .from('applications')
            .insert([{ job_id, employee_id, status: 'applied' }])
            .select()
            .single();

        if (error) return res.status(400).json({ error: error.message });
        res.status(201).json({ message: 'Applied successfully', application: data });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Employee View: Get applications for a specific employee
router.get('/employee/:id', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('applications')
            .select('*')
            .eq('employee_id', req.params.id)
            .order('created_at', { ascending: false });

        if (error) return res.status(400).json({ error: error.message });

        // For each application, get the job details and employer name
        const enriched = await Promise.all(data.map(async (app) => {
            const { data: job } = await supabase
                .from('jobs')
                .select('title, salary, location, employer_id')
                .eq('id', app.job_id)
                .single();

            let employerName = 'Unknown';
            if (job?.employer_id) {
                const { data: employer } = await supabase
                    .from('users')
                    .select('name')
                    .eq('id', job.employer_id)
                    .single();
                employerName = employer?.name || 'Unknown';
            }

            return {
                ...app,
                jobs: {
                    title: job?.title,
                    salary: job?.salary,
                    location: job?.location,
                    employer_name: employerName
                }
            };
        }));

        res.json(enriched);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Employer View: Get applications for a specific job
router.get('/job/:id', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('applications')
            .select('*')
            .eq('job_id', req.params.id)
            .order('created_at', { ascending: false });

        if (error) return res.status(400).json({ error: error.message });

        // Enrich with employee details
        const enriched = await Promise.all(data.map(async (app) => {
            const { data: employee } = await supabase
                .from('users')
                .select('name, phone, skills, experience, email, languages')
                .eq('id', app.employee_id)
                .single();

            return { ...app, users: employee || { name: 'Unknown', phone: 'N/A', skills: 'N/A' } };
        }));

        res.json(enriched);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Employer Action: Update application status
router.patch('/:id/status', async (req, res) => {
    const { status } = req.body;
    try {
        const { data, error } = await supabase
            .from('applications')
            .update({ status })
            .eq('id', req.params.id)
            .select()
            .single();
            
        if (error) return res.status(400).json({ error: error.message });
        res.json({ message: `Application ${status}`, application: data });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
