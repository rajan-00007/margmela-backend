'use client';

import React, { useState } from 'react';
import { useApi } from '../context/ApiContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import {
  PageWrapper,
  HeaderSection,
  PageTitle,
  PageDescription,
  NoEventContainer,
  NoEventTitle,
  NoEventDesc,
  BundlesLayoutGrid,
  CardTitle,
  CardBodyWrapper,
  TargetDetailsPanel,
  PanelHeaderLabel,
  EventName,
  EventIdMono,
  EventStatus,
  EventVersion,
  HelpText,
  LoadingCenter,
  Spinner,
  LoadingTitle,
  LoadingDesc,
  EmptyConsoleState,
  ErrorConsoleBox,
  ErrorHeader,
  ErrorMessage,
  SuccessOutputContainer,
  SuccessBanner,
  StatsOutputGrid,
  StatBox,
  StatLabel,
  StatValue,
  StorageTargetBox,
  StorageUrlMono,
  DownloadActionArea,
} from './styled';


export default function BundlesCenter() {
  const { apiFetch, selectedEvent, setSelectedEvent } = useApi();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [bundleData, setBundleData] = useState<any>(null);

  const handlePublishEvent = async () => {
    if (!selectedEvent) return;

    setLoading(true);
    setError('');
    setSuccess('');
    setBundleData(null);

    try {
      const response = await apiFetch(`/api/events/${selectedEvent.id}/publish`, {
        method: 'POST',
      });

      if (response && response.success) {
        setSuccess('Event bundle successfully generated and published!');
        setBundleData(response.data);
        
        // Refresh the selected event context (it now has updated version and status = 'published')
        if (selectedEvent) {
          setSelectedEvent({
            ...selectedEvent,
            status: 'published',
            bundle_version: response.data.version,
            current_bundle_id: response.data.id,
          });
        }
      } else {
        throw new Error(response.message || 'Server returned publish failure');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to compile and publish event bundle');
    } finally {
      setLoading(false);
    }
  };

  // Human readable bundle size formatter
  const formatBytes = (bytes: number | null | undefined): string => {
    if (!bytes) return 'N/A';
    const k = 1024;
    const dm = 2;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  return (
    <PageWrapper className="fade-in">
      <HeaderSection>
        <PageTitle>Publishing & Melapack Bundling Center</PageTitle>
        <PageDescription>
          Publish active events to generate a SQLite DB structure, package assets, compile them into a unified `.melapack` compression file, and host it on MinIO.
        </PageDescription>
      </HeaderSection>

      {!selectedEvent ? (
        <NoEventContainer>
          <svg width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <NoEventTitle>No Active Event Selected</NoEventTitle>
          <NoEventDesc>
            You must choose an event in the <a href="/events">Events Manager</a> first before executing bundling steps.
          </NoEventDesc>
        </NoEventContainer>
      ) : (
        <BundlesLayoutGrid>
          {/* Action Trigger Card */}
          <Card>
            <Card.Header>
              <CardTitle>Bundle Compilation</CardTitle>
            </Card.Header>
            <CardBodyWrapper>
              <TargetDetailsPanel>
                <PanelHeaderLabel>Target Event Details</PanelHeaderLabel>
                <EventName>{selectedEvent.name}</EventName>
                <EventIdMono>ID: {selectedEvent.id.slice(0, 8)}...</EventIdMono>
                <EventStatus>
                  Status: <span>{selectedEvent.status}</span>
                </EventStatus>
                <EventVersion>
                  Current Version: <strong>{selectedEvent.bundle_version || 0}</strong>
                </EventVersion>
              </TargetDetailsPanel>

              <HelpText>
                Publishing triggers a synchronous build that validates the presence of bounding box boundaries and route graphs, packs POIs, writes queries, creates SQLite db, and writes index files.
              </HelpText>

              <Button
                $variant="primary"
                $fullWidth
                onClick={handlePublishEvent}
                disabled={loading}
                icon={
                  !loading && (
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                  )
                }
              >
                {loading ? 'Compiling Bundle...' : 'Compile & Publish Bundle'}
              </Button>
            </CardBodyWrapper>
          </Card>

          {/* Results Card */}
          <Card>
            <Card.Header>
              <CardTitle>Bundle Compilation Status</CardTitle>
            </Card.Header>
            <CardBodyWrapper style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              {loading && (
                <LoadingCenter>
                  <Spinner />
                  <LoadingTitle>Generating `.melapack` ZIP Archive...</LoadingTitle>
                  <LoadingDesc>
                    Exporting tables into SQLite, writing metadata headers, executing checksum compression, and uploading ZIP block to MinIO object storage...
                  </LoadingDesc>
                </LoadingCenter>
              )}

              {!loading && !bundleData && !error && (
                <EmptyConsoleState>
                  No compilation logs. Hit &quot;Compile &amp; Publish Bundle&quot; to begin building your package.
                </EmptyConsoleState>
              )}

              {error && (
                <ErrorConsoleBox>
                  <ErrorHeader>
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <span>BUNDLE GENERATION FAILED</span>
                  </ErrorHeader>
                  <ErrorMessage>{error}</ErrorMessage>
                </ErrorConsoleBox>
              )}

              {success && bundleData && (
                <SuccessOutputContainer>
                  {/* Success Banner */}
                  <SuccessBanner>
                    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{success}</span>
                  </SuccessBanner>

                  {/* Compilation outputs */}
                  <StatsOutputGrid>
                    <StatBox>
                      <StatLabel>Compilation Version</StatLabel>
                      <StatValue $color="#818cf8">Version #{bundleData.version}</StatValue>
                    </StatBox>

                    <StatBox>
                      <StatLabel>Checksum Size</StatLabel>
                      <StatValue $color="#22d3ee">{formatBytes(bundleData.size)}</StatValue>
                    </StatBox>
                  </StatsOutputGrid>

                  <StorageTargetBox>
                    <PanelHeaderLabel>MinIO Object Storage Target</PanelHeaderLabel>
                    <StorageUrlMono>{bundleData.url}</StorageUrlMono>
                    
                    <DownloadActionArea>
                      <a
                        href={bundleData.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        <span>Download Compiled Package (.melapack)</span>
                      </a>
                    </DownloadActionArea>
                  </StorageTargetBox>
                </SuccessOutputContainer>
              )}
            </CardBodyWrapper>
          </Card>
        </BundlesLayoutGrid>
      )}
    </PageWrapper>
  );
}


