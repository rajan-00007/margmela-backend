'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useApi } from '../context/ApiContext';
import { Heart, Trash2, MessageSquare, Award, AlertCircle, RefreshCw, Star } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import {
  PageContainer,
  HeaderSection,
  HeaderTitles,
  PageTitle,
  PageSubtitle,
  StatsGrid,
  StatCard,
  StatLabel,
  StatValue,
  StatSub,
  RatingBreakdownRow,
  StarLabel,
  BarWrapper,
  BarFill,
  BarCount,
  FilterSection,
  FilterLabel,
  EventSelector,
  TableContainer,
  FeedbackTable,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
  ThoughtsText,
  StarsWrapper,
  ActionButton,
  EmptyState,
  LoadingSpinner
} from './styled';

export default function VisitorFeedbackPage() {
  const { apiFetch, selectedEvent } = useApi();
  const [events, setEvents] = useState<any[]>([]);
  const [selectedFilterId, setSelectedFilterId] = useState<string>('all');
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [error, setError] = useState('');

  // Fetch all events for the dropdown
  const loadEvents = useCallback(async () => {
    try {
      const res = await apiFetch('/api/events');
      if (res && res.data) {
        setEvents(res.data || []);
      }
    } catch (err: any) {
      console.error('Failed to load events list:', err);
    }
  }, [apiFetch]);

  // Fetch feedback list based on filter
  const loadFeedbacks = useCallback(async (eventId?: string) => {
    try {
      setLoading(true);
      setError('');
      
      const queryParam = eventId && eventId !== 'all' ? `?eventId=${eventId}` : '';
      const res = await apiFetch(`/api/feedback${queryParam}`);
      
      if (res && res.data) {
        setFeedbacks(res.data || []);
      } else {
        setFeedbacks([]);
      }
    } catch (err: any) {
      console.error('Failed to fetch feedback:', err);
      setError(err.message || 'Could not load visitor feedback.');
    } finally {
      setLoading(false);
    }
  }, [apiFetch]);

  // Synchronize filter when active event changes in context
  useEffect(() => {
    loadEvents();
    if (selectedEvent) {
      setSelectedFilterId(selectedEvent.id);
      loadFeedbacks(selectedEvent.id);
    } else {
      setSelectedFilterId('all');
      loadFeedbacks('all');
    }
  }, [selectedEvent, loadEvents, loadFeedbacks]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setSelectedFilterId(val);
    loadFeedbacks(val);
  };

  const handleDeleteFeedback = async (id: string) => {
    if (!confirm('Are you sure you want to delete this feedback?')) return;
    try {
      setActionLoading(id);
      await apiFetch(`/api/feedback/${id}`, { method: 'DELETE' });
      // Remove from list
      setFeedbacks((prev) => prev.filter((item) => item.id !== id));
    } catch (err: any) {
      alert(err.message || 'Failed to delete feedback');
    } finally {
      setActionLoading(null);
    }
  };

  // Calculate statistics
  const totalCount = feedbacks.length;
  const ratingAverage = totalCount > 0 
    ? (feedbacks.reduce((sum, item) => sum + item.rating, 0) / totalCount).toFixed(1)
    : '0.0';

  const starCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  feedbacks.forEach((item) => {
    const rating = Math.min(5, Math.max(1, Math.round(item.rating))) as 1 | 2 | 3 | 4 | 5;
    starCounts[rating] = (starCounts[rating] || 0) + 1;
  });

  return (
    <PageContainer>
      <HeaderSection>
        <HeaderTitles>
          <PageTitle>Visitor Feedback Reviews</PageTitle>
          <PageSubtitle>
            Monitor ratings and qualitative thoughts submitted by visitors via mobile application.
          </PageSubtitle>
        </HeaderTitles>
        <Button 
          $variant="secondary" 
          onClick={() => loadFeedbacks(selectedFilterId)} 
          disabled={loading}
          title="Refresh List"
          style={{ display: 'flex', gap: '8px', alignItems: 'center' }}
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          Refresh
        </Button>
      </HeaderSection>

      {/* Aggregate Statistics Overview */}
      <StatsGrid>
        <StatCard>
          <StatLabel>Aggregate score</StatLabel>
          <StatValue>
            {ratingAverage}
            <StatSub>/ 5.0</StatSub>
          </StatValue>
          <div style={{ display: 'flex', color: '#f59e0b', gap: '2px' }}>
            {[1, 2, 3, 4, 5].map((star) => {
              const score = parseFloat(ratingAverage);
              return (
                <Star
                  key={star}
                  size={18}
                  fill={star <= Math.round(score) ? '#f59e0b' : 'none'}
                  stroke={star <= Math.round(score) ? '#f59e0b' : '#4b5563'}
                />
              );
            })}
          </div>
        </StatCard>

        <StatCard>
          <StatLabel>Total submissions</StatLabel>
          <StatValue>
            {totalCount}
            <StatSub>reviews</StatSub>
          </StatValue>
          <div style={{ display: 'flex', color: '#38bdf8', gap: '8px', alignItems: 'center', fontSize: '13px' }}>
            <MessageSquare size={16} />
            <span>Voice of Visitors channel live</span>
          </div>
        </StatCard>

        <StatCard style={{ gap: '4px' }}>
          <StatLabel>Rating breakdown</StatLabel>
          {([5, 4, 3, 2, 1] as const).map((star) => {
            const count = starCounts[star] || 0;
            const pct = totalCount > 0 ? (count / totalCount) * 100 : 0;
            return (
              <RatingBreakdownRow key={star}>
                <StarLabel>{star}</StarLabel>
                <Heart size={10} fill="#f59e0b" color="#f59e0b" />
                <BarWrapper>
                  <BarFill $width={pct} />
                </BarWrapper>
                <BarCount>{count}</BarCount>
              </RatingBreakdownRow>
            );
          })}
        </StatCard>
      </StatsGrid>

      {/* Filter Toolbar */}
      <FilterSection>
        <FilterLabel>
          <Award size={18} color="#a1a1aa" />
          <span>Active Filter:</span>
        </FilterLabel>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <span style={{ fontSize: '13px', color: '#a1a1aa' }}>Select Event scope:</span>
          <EventSelector value={selectedFilterId} onChange={handleFilterChange}>
            <option value="all">All Event Catalogs</option>
            {events.map((e) => (
              <option key={e.id} value={e.id}>
                {e.name}
              </option>
            ))}
          </EventSelector>
        </div>
      </FilterSection>

      {/* Database Error Banner */}
      {error && (
        <div style={{
          padding: '16px',
          borderRadius: '12px',
          background: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid #ef4444',
          color: '#f87171',
          display: 'flex',
          gap: '12px',
          alignItems: 'center'
        }}>
          <AlertCircle size={20} />
          <div>{error}</div>
        </div>
      )}

      {/* Feedback Table */}
      <TableContainer>
        {loading ? (
          <LoadingSpinner>
            <RefreshCw size={24} className="animate-spin" />
            <span>Loading reviews...</span>
          </LoadingSpinner>
        ) : feedbacks.length === 0 ? (
          <EmptyState>
            <Heart size={48} fill="none" color="#4b5563" strokeWidth={1.5} />
            <h4>No Feedback Reviews Found</h4>
            <p>
              {selectedFilterId === 'all'
                ? 'No visitor feedback has been submitted to MelaMarg yet.'
                : 'No reviews found for this event catalog yet.'}
            </p>
          </EmptyState>
        ) : (
          <FeedbackTable>
            <TableHead>
              <tr>
                <TableHeader style={{ width: '140px' }}>Rating</TableHeader>
                <TableHeader style={{ width: '180px' }}>Event scope</TableHeader>
                <TableHeader>Visitor thoughts</TableHeader>
                <TableHeader style={{ width: '160px' }}>Submitted at</TableHeader>
                <TableHeader style={{ width: '80px', textAlign: 'right' }}>Actions</TableHeader>
              </tr>
            </TableHead>
            <tbody>
              {feedbacks.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <StarsWrapper>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Heart
                          key={star}
                          size={14}
                          fill={star <= item.rating ? '#ef4444' : 'none'}
                          stroke={star <= item.rating ? '#ef4444' : '#4b5563'}
                        />
                      ))}
                    </StarsWrapper>
                  </TableCell>
                  <TableCell style={{ fontWeight: 500 }}>
                    {item.event_name || <span style={{ color: '#6b7280', fontSize: '13px' }}>Unspecified Event</span>}
                  </TableCell>
                  <TableCell>
                    <ThoughtsText>
                      {item.thoughts || <span style={{ color: '#6b7280', fontStyle: 'italic' }}>No comment provided</span>}
                    </ThoughtsText>
                  </TableCell>
                  <TableCell style={{ color: '#a1a1aa', fontSize: '13px' }}>
                    {new Date(item.created_at).toLocaleString()}
                  </TableCell>
                  <TableCell style={{ textAlign: 'right' }}>
                    <ActionButton
                      onClick={() => handleDeleteFeedback(item.id)}
                      disabled={actionLoading === item.id}
                      title="Delete Feedback"
                    >
                      <Trash2 size={16} />
                    </ActionButton>
                  </TableCell>
                </TableRow>
              ))}
            </tbody>
          </FeedbackTable>
        )}
      </TableContainer>
    </PageContainer>
  );
}
