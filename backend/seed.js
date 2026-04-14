const supabase = require('./supabaseClient');

async function clearOldData() {
    console.log("Clearing old data...");
    await supabase.from('applications').delete().neq('id', 0);
    await supabase.from('jobs').delete().neq('id', 0);
    await supabase.from('users').delete().neq('id', '00000000-0000-0000-0000-000000000000');
}

async function seedData() {
    try {
        console.log("Starting seed process...");
        // Clear everything to avoid duplicates if they run it multiple times
        // In Supabase, if tables have cascade, deleting users might delete the rest.
        await clearOldData();

        console.log("1. Creating Users...");
        const usersToCreate = [
            { phone: '9999999999', name: 'Admin Master', role: 'admin', location: 'Delhi', email: 'admin@rozgardo.com' },
            { phone: '8888888888', name: 'Tata Motors', role: 'employer', location: 'Mumbai', email: 'hr@tatamotors.com' },
            { phone: '7777777777', name: 'Ramesh Singh', role: 'employee', location: 'Mumbai', skills: 'Driving, Maintenance', email: 'ramesh@gmail.com', languages: 'Hindi, Marathi' },
            { phone: '6666666666', name: 'Suresh Kumar', role: 'employee', location: 'Pune', skills: 'Security, Night Watch', languages: 'Hindi, English' }
        ];

        const { data: users, error: userErr } = await supabase.from('users').insert(usersToCreate).select();
        if (userErr) throw userErr;

        const employerId = users.find(u => u.role === 'employer').id;
        const employee1 = users.find(u => u.phone === '7777777777').id;
        const employee2 = users.find(u => u.phone === '6666666666').id;

        console.log("2. Creating Jobs...");
        const jobsToCreate = [
            { 
               title: 'Experienced Commercial Driver', 
               category: 'Driver', 
               salary: 25000, 
               location: 'Mumbai', 
               description: 'Looking for a verified commercial driver with 5+ years experience.',
               status: 'approved', 
               employer_id: employerId 
            },
            { 
               title: 'Night Security Guard', 
               category: 'Security', 
               salary: 18000, 
               location: 'Pune', 
               description: 'Need a watchful night guard for a private apartment complex.',
               status: 'pending', 
               employer_id: employerId 
            }
        ];

        const { data: jobs, error: jobErr } = await supabase.from('jobs').insert(jobsToCreate).select();
        if (jobErr) throw jobErr;

        const approvedJobId = jobs.find(j => j.status === 'approved').id;
        const pendingJobId = jobs.find(j => j.status === 'pending').id;

        console.log("3. Creating Applications...");
        const appsToCreate = [
            { job_id: approvedJobId, employee_id: employee1, status: 'applied' }
        ];

        const { error: appErr } = await supabase.from('applications').insert(appsToCreate);
        if (appErr) throw appErr;

        console.log("\n==================================");
        console.log("Database Seeded Successfully! 🎉");
        console.log("You can now login with these numbers:");
        console.log("-> Admin: 9999999999");
        console.log("-> Employer: 8888888888");
        console.log("-> Employee (Ramesh): 7777777777");
        console.log("-> Employee (Suresh): 6666666666");
        console.log("==================================\n");

    } catch (err) {
        console.error("\nERROR SEEDING DATABASE:");
        console.error(err.message);
    }
}

seedData();
