import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../../components/Button';
import { MapPin, IndianRupee, Briefcase, Search, X, ArrowLeft } from 'lucide-react';

const AllJobs = ({ user }) => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await fetch('http://localhost:5001/api/jobs?status=approved');
      if (res.ok) {
        const data = await res.json();
        setJobs(data);
      } else {
        throw new Error('Failed to fetch jobs');
      }
    } catch (err) {
      console.error(err);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  // Extract unique locations and categories for filter dropdowns
  const locations = useMemo(() => [...new Set(jobs.map(j => j.location).filter(Boolean))].sort(), [jobs]);
  const categories = useMemo(() => [...new Set(jobs.map(j => j.category).filter(Boolean))].sort(), [jobs]);

  // Filtered jobs
  const filteredJobs = useMemo(() => {
    return jobs.filter(job => {
      const matchesSearch = !searchQuery ||
        job.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.employer_name?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesLocation = !locationFilter || job.location === locationFilter;
      const matchesCategory = !categoryFilter || job.category === categoryFilter;
      return matchesSearch && matchesLocation && matchesCategory;
    });
  }, [jobs, searchQuery, locationFilter, categoryFilter]);

  const hasActiveFilters = searchQuery || locationFilter || categoryFilter;

  const clearFilters = () => {
    setSearchQuery('');
    setLocationFilter('');
    setCategoryFilter('');
  };

  return (
    <div style={{ width: '100%', maxWidth: '1200px', margin: '0 auto', padding: '2rem 1.5rem', minHeight: 'calc(100vh - 64px)' }}>

      {/* Back + Header */}
      <div style={{ marginBottom: '2rem' }}>
        <button
          onClick={() => navigate('/')}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.375rem',
            background: 'none', border: 'none', cursor: 'pointer',
            color: '#4F46E5', fontWeight: 600, fontSize: '0.875rem',
            marginBottom: '1rem', padding: 0,
          }}
        >
          <ArrowLeft size={16} /> Back to Home
        </button>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.5rem' }}>All Jobs</h1>
        <p style={{ color: '#64748B', fontSize: '1.05rem' }}>Explore opportunities near you</p>
      </div>

      {/* Search + Filters Bar */}
      <div style={{
        display: 'flex', flexWrap: 'wrap', gap: '0.75rem',
        marginBottom: '2rem', padding: '1.25rem',
        background: 'white', borderRadius: '1rem',
        border: '1px solid #E5E7EB', boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
        alignItems: 'center',
      }}>
        {/* Search Input */}
        <div style={{ flex: '1 1 280px', position: 'relative' }}>
          <Search size={18} color="#94A3B8" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Search by title or company..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%', padding: '0.75rem 0.75rem 0.75rem 2.5rem',
              border: '1px solid #E2E8F0', borderRadius: '0.5rem',
              fontSize: '0.9rem', outline: 'none', background: '#F8FAFC',
              fontFamily: 'inherit',
            }}
          />
        </div>

        {/* Location Filter */}
        <select
          value={locationFilter}
          onChange={(e) => setLocationFilter(e.target.value)}
          style={{
            padding: '0.75rem 1rem', border: '1px solid #E2E8F0',
            borderRadius: '0.5rem', fontSize: '0.875rem', background: '#F8FAFC',
            color: locationFilter ? '#0F172A' : '#94A3B8', cursor: 'pointer',
            fontFamily: 'inherit', minWidth: '140px',
          }}
        >
          <option value="">All Locations</option>
          {locations.map(loc => <option key={loc} value={loc}>{loc}</option>)}
        </select>

        {/* Category Filter */}
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          style={{
            padding: '0.75rem 1rem', border: '1px solid #E2E8F0',
            borderRadius: '0.5rem', fontSize: '0.875rem', background: '#F8FAFC',
            color: categoryFilter ? '#0F172A' : '#94A3B8', cursor: 'pointer',
            fontFamily: 'inherit', minWidth: '140px',
          }}
        >
          <option value="">All Categories</option>
          {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
        </select>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.25rem',
              padding: '0.75rem 1rem', background: '#FEF2F2', color: '#DC2626',
              border: '1px solid #FECACA', borderRadius: '0.5rem',
              fontWeight: 600, fontSize: '0.8rem', cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            <X size={14} /> Clear
          </button>
        )}
      </div>

      {/* Results Count */}
      <div style={{ marginBottom: '1.5rem', fontSize: '0.875rem', color: '#64748B', fontWeight: 500 }}>
        Showing {filteredJobs.length} of {jobs.length} jobs
        {hasActiveFilters && <span> (filtered)</span>}
      </div>

      {/* Job Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: '#64748B', fontSize: '1.1rem' }}>Loading jobs...</div>
      ) : filteredJobs.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: '#64748B' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>No jobs found</h3>
          <p>Try adjusting your search or filters.</p>
          {hasActiveFilters && (
            <button onClick={clearFilters} style={{ marginTop: '1rem', padding: '0.5rem 1.5rem', background: '#4F46E5', color: 'white', border: 'none', borderRadius: '0.5rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
              Clear all filters
            </button>
          )}
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
          gap: '1.5rem',
        }}>
          {filteredJobs.map((job) => {
            const initial = job.employer_name ? job.employer_name.charAt(0).toUpperCase() : 'C';
            return (
              <div
                key={job.id}
                onClick={() => navigate(`/jobs/${job.id}`)}
                style={{
                  background: 'white',
                  borderRadius: '1rem',
                  padding: '1.5rem',
                  border: '1px solid #E5E7EB',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                  cursor: 'pointer',
                  transition: 'transform 0.2s, box-shadow 0.2s, border-color 0.2s',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.1)';
                  e.currentTarget.style.borderColor = '#4F46E5';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.05)';
                  e.currentTarget.style.borderColor = '#E5E7EB';
                }}
              >
                {/* Top */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '1rem' }}>
                    <div style={{
                      width: '44px', height: '44px', borderRadius: '50%',
                      background: 'linear-gradient(135deg, #EEF2FF, #E0E7FF)',
                      color: '#4F46E5', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: 800, fontSize: '1.1rem', flexShrink: 0,
                      border: '1px solid rgba(79,70,229,0.1)',
                    }}>
                      {initial}
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <h3 style={{
                        fontSize: '1.05rem', fontWeight: 700, color: '#0F172A', lineHeight: 1.35,
                        display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
                        minHeight: '2.8rem',
                      }}>
                        {job.title}
                      </h3>
                      <p style={{ color: '#64748B', fontSize: '0.8rem', fontWeight: 500, marginTop: '0.25rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {job.employer_name}
                      </p>
                    </div>
                  </div>

                  {/* Category tag */}
                  <div style={{ marginBottom: '1rem' }}>
                    <span style={{
                      background: '#F8FAFC', color: '#475569', fontSize: '0.7rem', fontWeight: 700,
                      padding: '0.3rem 0.65rem', borderRadius: '0.375rem', textTransform: 'uppercase',
                      border: '1px solid #E2E8F0', display: 'inline-block',
                    }}>
                      {job.category}
                    </span>
                  </div>
                </div>

                {/* Bottom */}
                <div>
                  <div style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '0.75rem 0', borderTop: '1px solid #F1F5F9',
                  }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#475569', fontSize: '0.8rem', fontWeight: 600 }}>
                      <MapPin size={15} color="#94A3B8" /> {job.location}
                    </span>
                    <span style={{
                      display: 'flex', alignItems: 'center', gap: '0.15rem',
                      fontWeight: 800, color: '#059669', fontSize: '0.95rem',
                      background: '#ECFDF5', padding: '0.25rem 0.6rem', borderRadius: '0.375rem',
                    }}>
                      <IndianRupee size={15} /> {job.salary}
                    </span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', paddingTop: '0.75rem', borderTop: '1px solid #F1F5F9' }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Link to={`/jobs/${job.id}`} style={{ textDecoration: 'none' }}>
                      <button style={{
                        width: '100%', padding: '0.6rem', background: 'white', color: '#334155',
                        border: '1px solid #E2E8F0', borderRadius: '0.5rem', fontSize: '0.8rem',
                        fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
                      }}>
                        View Details
                      </button>
                    </Link>
                    <Link to={`/jobs/${job.id}`} style={{ textDecoration: 'none' }}>
                      <button style={{
                        width: '100%', padding: '0.6rem',
                        background: 'linear-gradient(to right, #4F46E5, #6366F1)',
                        color: 'white', border: 'none', borderRadius: '0.5rem',
                        fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
                      }}>
                        Apply Now
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AllJobs;
