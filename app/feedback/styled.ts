import styled, { css, keyframes } from 'styled-components';

export const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  max-width: 1400px;
  margin: 0 auto;
  padding: 16px;
`;

export const HeaderSection = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 16px;
  
  @media (min-width: ${props => props.theme.breakpoints.tablet}) {
    flex-direction: row;
    align-items: center;
  }
`;

export const HeaderTitles = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const PageTitle = styled.h2`
  font-size: 28px;
  font-weight: 800;
  letter-spacing: -0.025em;
  background: linear-gradient(135deg, #ffffff 0%, #a1a1aa 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin: 0;
`;

export const PageSubtitle = styled.p`
  font-size: 14px;
  color: ${props => props.theme.colors.textSecondary};
  margin: 0;
  line-height: 1.5;
`;

export const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;

  @media (min-width: ${props => props.theme.breakpoints.tablet}) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

export const StatCard = styled.div`
  padding: 24px;
  border-radius: 16px;
  border: 1px solid ${props => props.theme.colors.border};
  background: rgba(20, 20, 23, 0.4);
  backdrop-filter: blur(8px);
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const StatLabel = styled.span`
  font-size: 13px;
  font-weight: 500;
  color: ${props => props.theme.colors.textSecondary};
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

export const StatValue = styled.div`
  font-size: 36px;
  font-weight: 800;
  color: #ffffff;
  display: flex;
  align-items: baseline;
  gap: 6px;
`;

export const StatSub = styled.span`
  font-size: 14px;
  font-weight: 400;
  color: ${props => props.theme.colors.textSecondary};
`;

export const RatingBreakdownRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
`;

export const StarLabel = styled.span`
  font-size: 12px;
  color: ${props => props.theme.colors.textSecondary};
  width: 12px;
  text-align: right;
`;

export const BarWrapper = styled.div`
  flex: 1;
  height: 6px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 3px;
  overflow: hidden;
`;

export const BarFill = styled.div<{ $width: number }>`
  height: 100%;
  width: ${props => props.$width}%;
  background: #f59e0b;
  border-radius: 3px;
  transition: width 0.3s ease;
`;

export const BarCount = styled.span`
  font-size: 12px;
  color: ${props => props.theme.colors.textSecondary};
  width: 24px;
  text-align: right;
`;

export const FilterSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  border-radius: 12px;
  border: 1px solid ${props => props.theme.colors.border};
  background: rgba(20, 20, 23, 0.2);
  gap: 16px;
  flex-wrap: wrap;
`;

export const FilterLabel = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #ffffff;
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const EventSelector = styled.select`
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid ${props => props.theme.colors.border};
  background: #09090b;
  color: #ffffff;
  outline: none;
  font-size: 14px;
  cursor: pointer;

  &:focus {
    border-color: ${props => props.theme.colors.primary};
  }
`;

export const TableContainer = styled.div`
  border-radius: 16px;
  border: 1px solid ${props => props.theme.colors.border};
  background: rgba(20, 20, 23, 0.4);
  backdrop-filter: blur(8px);
  overflow: hidden;
`;

export const FeedbackTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  text-align: left;
`;

export const TableHead = styled.thead`
  background: rgba(255, 255, 255, 0.02);
  border-bottom: 1px solid ${props => props.theme.colors.border};
`;

export const TableHeader = styled.th`
  padding: 16px 20px;
  font-size: 13px;
  font-weight: 600;
  color: ${props => props.theme.colors.textSecondary};
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

export const TableRow = styled.tr`
  border-bottom: 1px solid ${props => props.theme.colors.border};
  transition: background-color 0.2s ease;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: rgba(255, 255, 255, 0.01);
  }
`;

export const TableCell = styled.td`
  padding: 16px 20px;
  font-size: 14px;
  color: #ffffff;
  vertical-align: middle;
`;

export const ThoughtsText = styled.p`
  margin: 0;
  font-size: 14px;
  color: #ffffff;
  line-height: 1.5;
  white-space: pre-wrap;
`;

export const StarsWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 2px;
  color: #f59e0b;
`;

export const ActionButton = styled.button`
  background: none;
  border: none;
  color: #ef4444;
  cursor: pointer;
  padding: 6px;
  border-radius: 6px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(239, 68, 68, 0.1);
    color: #f87171;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const EmptyState = styled.div`
  padding: 48px;
  text-align: center;
  color: ${props => props.theme.colors.textSecondary};
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;

  h4 {
    margin: 0;
    color: #ffffff;
    font-size: 16px;
    font-weight: 600;
  }

  p {
    margin: 0;
    font-size: 14px;
  }
`;

export const LoadingSpinner = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 48px;
  color: ${props => props.theme.colors.textSecondary};
  gap: 12px;
`;
